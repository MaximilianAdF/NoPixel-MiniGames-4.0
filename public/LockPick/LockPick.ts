import LockPickPuzzle, {toggleSettings, applySettings, resetSettings} from "../scripts/LockPickPuzzle";

LockPickPuzzle(4, 20);

window.toggleSettings = toggleSettings;
window.applySettings = applySettings;
window.resetSettings = resetSettings;
