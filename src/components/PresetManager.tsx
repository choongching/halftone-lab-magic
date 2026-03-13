import { useEffect, useState } from "react";
import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection } from "./ControlSection";
import { Trash2 } from "lucide-react";

export function PresetManager() {
  const { savedPresets, savePreset, loadPreset, deletePreset, loadSavedPresets } = useHalftoneStore();
  const [newName, setNewName] = useState("");

  useEffect(() => {
    loadSavedPresets();
  }, [loadSavedPresets]);

  const handleSave = () => {
    if (newName.trim()) {
      savePreset(newName.trim());
      setNewName("");
    }
  };

  return (
    <ControlSection title="My Presets">
      <div className="flex gap-1.5">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Preset name…"
          className="flex-1 rounded-md border border-border bg-secondary px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground"
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <button
          onClick={handleSave}
          disabled={!newName.trim()}
          className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground disabled:opacity-40"
        >
          Save
        </button>
      </div>
      {savedPresets.length > 0 && (
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {savedPresets.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-md bg-secondary px-2 py-1">
              <button
                onClick={() => loadPreset(p)}
                className="text-xs text-secondary-foreground hover:text-foreground truncate flex-1 text-left"
              >
                {p.name}
              </button>
              <button
                onClick={() => deletePreset(p.id)}
                className="ml-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </ControlSection>
  );
}
