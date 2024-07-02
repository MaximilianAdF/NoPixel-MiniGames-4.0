export type Puzzle = 
    | 'Thermite' 
    | 'RoofRunning' 
    | 'Laundromat' 
    | 'Lockpick' 
    | 'RepairKit' 
    | 'WordMemory' 
    | 'Chopping' 
    | 'PinCracker'

// None means that the user has their own preset (defined in the minigame object (letters, time limit, etc.))
type PresetMap = {
    Thermite: 
        | 'Maze Bank - Sewer'
        | 'Maze Bank - Vault'
        | 'Custom';
    RoofRunning: 
        | 'Standard'
        | 'Custom';
    Laundromat:
        | 'Standard'
        | 'Custom';
    Lockpick:
        | 'Standard'
        | 'Custom';
    RepairKit:
        | 'Standard'
        | 'Custom';
    WordMemory:
        | 'Standard'
        | 'Custom';
    Chopping:
        | 'Standard'
        | 'Custom';
    PinCracker:
        | 'Standard'
        | 'Custom';
} 

export type Preset<P extends Puzzle> = P extends keyof PresetMap ? PresetMap[P] : never;

export type SortOrder = 
    | 'asc' 
    | 'desc';

export type SortBy =
    | 'highscore.averageTime'
    | 'highscore.streak'
    | 'date';

function getPresets<P extends Puzzle>(puzzle: P): Preset<P>[] {
    const presetMap: Record<Puzzle, string[]> = {
        Thermite: [
        'Maze Bank - Sewer',
        'Maze Bank - Vault',
        'Custom'
        ],
        RoofRunning: [
        'Standard',
        'Custom'
        ],
        Laundromat: [
        'Standard',
        'Custom'
        ],
        Lockpick: [
        'Standard',
        'Custom'
        ],
        RepairKit: [
        'Standard',
        'Custom'
        ],
        WordMemory: [
        'Standard',
        'Custom'
        ],
        Chopping: [
        'Standard',
        'Custom'
        ],
        PinCracker: [
        'Standard',
        'Custom'
        ]
    };
    return presetMap[puzzle] as Preset<P>[];
}

export { getPresets };
