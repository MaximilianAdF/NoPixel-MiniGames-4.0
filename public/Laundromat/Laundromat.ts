import LockPickPuzzle, {toggleSettings, applySettings, resetSettings} from "@/public/scripts/LockPickPuzzle.js";

LockPickPuzzle(5, 12);

window.toggleSettings = toggleSettings;
window.applySettings = applySettings;
window.resetSettings = resetSettings;
