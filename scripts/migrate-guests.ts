/**
 * Migration Script: Update existing guest accounts
 * 
 * Run with: npx tsx scripts/migrate-guests.ts
 * 
 * This script:
 * 1. Finds all guest users (no discordId) with username 'Guest'
 * 2. Updates them to Guest#XXXXXX format (6-char alphanumeric)
 * 3. Adds isGuest: true flag to ALL guest accounts
 */

import { MongoClient } from 'mongodb';
import crypto from 'crypto';
import { config } from 'dotenv';

// Load .env.local so MONGODB_URI is available
config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

async function migrate() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('nopixel');
        const users = db.collection('users');

        console.log('🔍 Finding guest accounts...');

        // Find all guest users (no discordId)
        const guestUsers = await users.find({
            discordId: { $exists: false },
        }).toArray();

        console.log(`Found ${guestUsers.length} guest accounts total.`);

        // Step 1: Add isGuest flag to ALL guest accounts
        const flagResult = await users.updateMany(
            { discordId: { $exists: false } },
            { $set: { isGuest: true } }
        );
        console.log(`✅ Added isGuest flag to ${flagResult.modifiedCount} accounts.`);

        // Step 2: Fix guests with username 'Guest' (no discriminator in name)
        const genericGuests = await users.find({
            discordId: { $exists: false },
            username: 'Guest',
        }).toArray();

        console.log(`Found ${genericGuests.length} guests with generic 'Guest' username.`);

        let updated = 0;
        for (const guest of genericGuests) {
            // Use existing discriminator if it exists, otherwise generate new one
            let discriminator = guest.discriminator;
            if (!discriminator || discriminator.length < 5) {
                discriminator = crypto.randomUUID().slice(0, 6).toUpperCase();
            } else {
                // Pad existing 4-digit discriminators to keep them recognizable
                discriminator = discriminator.padStart(4, '0');
            }

            const newUsername = `Guest#${discriminator}`;

            await users.updateOne(
                { _id: guest._id },
                {
                    $set: {
                        username: newUsername,
                        displayName: newUsername,
                        discriminator: discriminator,
                    },
                }
            );
            updated++;
        }

        console.log(`✅ Updated ${updated} generic 'Guest' accounts to unique names.`);

        // Step 3: Also update guests that have Guest#XXXX format but no displayName
        const noDisplayName = await users.updateMany(
            {
                discordId: { $exists: false },
                displayName: { $exists: false },
                username: { $regex: /^Guest#/ },
            },
            [
                {
                    $set: {
                        displayName: '$username',
                    },
                },
            ]
        );
        console.log(`✅ Set displayName for ${noDisplayName.modifiedCount} additional guests.`);

        // Summary
        const remainingGeneric = await users.countDocuments({
            discordId: { $exists: false },
            username: 'Guest',
        });
        console.log(`\n📊 Summary:`);
        console.log(`  Total guests: ${guestUsers.length}`);
        console.log(`  Updated to unique names: ${updated}`);
        console.log(`  Remaining generic 'Guest': ${remainingGeneric}`);
        console.log('✅ Migration complete!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

migrate();
