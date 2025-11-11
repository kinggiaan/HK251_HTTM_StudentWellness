import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import svgPaths from "../imports/svg-xhq8bqqtxc";

interface ModelConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModelConfigDialog({ open, onOpenChange }: ModelConfigDialogProps) {
  const [configName, setConfigName] = useState("My First Config");
  const [trainTestRatio, setTrainTestRatio] = useState(80);
  const [nEstimators, setNEstimators] = useState("100");
  const [maxFeatures, setMaxFeatures] = useState("sqrt");
  const [maxDepth, setMaxDepth] = useState("100");
  const [criterion, setCriterion] = useState("Gini");
  const [bootstrap, setBootstrap] = useState(true);
  
  const [selectedFeatures, setSelectedFeatures] = useState({
    feature1: true,
    feature2: true,
    feature3: true,
    feature4: true,
    feature5: true,
    feature6: true,
    feature7: true,
    feature8: false,
  });

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving configuration:", {
      configName,
      trainTestRatio,
      nEstimators,
      maxFeatures,
      maxDepth,
      criterion,
      bootstrap,
      selectedFeatures,
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this configuration?")) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1145px] p-0 bg-white rounded-[14px] max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogTitle className="sr-only">Edit Model Configuration</DialogTitle>
        <DialogDescription className="sr-only">
          Configure model parameters, features, and training settings
        </DialogDescription>
        <div className="relative p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[24px] text-black">
              Edit configuration
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="size-[24px] hover:opacity-70 transition-opacity"
            >
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                <path d={svgPaths.p2aa77200} fill="#1D1B20" />
              </svg>
            </button>
          </div>

          {/* Config Name */}
          <div className="mb-6">
            <input
              type="text"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              className="w-[312px] h-[56px] px-4 rounded-[14px] border border-[#969696] font-['Poppins:Medium',sans-serif] text-[20px] text-black text-center focus:outline-none focus:border-[#6750a4]"
            />
          </div>

          {/* Features Selection */}
          <div className="mb-6 p-6 border border-[#9e9e9e] rounded-[14px]">
            <h3 className="font-['Poppins:Medium',sans-serif] text-[20px] text-black mb-4">
              Features selection
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(selectedFeatures).map(([key, value], index) => (
                <div key={key} className="flex items-center gap-3">
                  <Checkbox
                    checked={value}
                    onCheckedChange={(checked) =>
                      setSelectedFeatures({ ...selectedFeatures, [key]: checked as boolean })
                    }
                    className="size-[18px]"
                  />
                  <span className="font-['Poppins:Regular',sans-serif] text-[16px] text-black">
                    Sleep quality
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Train:Test Ratio */}
          <div className="mb-6 p-6 border border-[#9e9e9e] rounded-[14px]">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="font-['Poppins:Medium',sans-serif] text-[20px] text-black">
                Train:Test ratio:
              </h3>
              <div className="font-['Poppins:Bold',sans-serif] text-[32px]">
                <span className="text-[#64cda3]">{trainTestRatio}</span>
                <span className="text-[#cccccc]">:</span>
                <span className="text-[#ed759b]">{100 - trainTestRatio}</span>
              </div>
            </div>
            <Slider
              value={[trainTestRatio]}
              onValueChange={(values) => setTrainTestRatio(values[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Parameters */}
          <div className="mb-6 p-6 border border-[#9e9e9e] rounded-[14px]">
            <h3 className="font-['Poppins:Medium',sans-serif] text-[20px] text-black mb-6">
              Parameters
            </h3>
            
            <div className="grid grid-cols-3 gap-6 mb-4">
              {/* N Estimators */}
              <div>
                <label className="font-['Poppins:Medium',sans-serif] text-[16px] text-black mb-2 block">
                  N Estimators:
                </label>
                <input
                  type="text"
                  value={nEstimators}
                  onChange={(e) => setNEstimators(e.target.value)}
                  className="w-full h-[38px] px-4 rounded-[10px] border border-[#AAAAAA] font-['Poppins:Medium',sans-serif] text-[16px] text-black text-right focus:outline-none focus:border-[#6750a4]"
                />
              </div>

              {/* Criterion */}
              <div>
                <label className="font-['Poppins:Medium',sans-serif] text-[16px] text-black mb-2 block">
                  Criterion:
                </label>
                <div className="relative">
                  <select
                    value={criterion}
                    onChange={(e) => setCriterion(e.target.value)}
                    className="w-full h-[38px] px-4 rounded-[10px] border border-[#AAAAAA] font-['Poppins:Medium',sans-serif] text-[16px] text-black text-right appearance-none focus:outline-none focus:border-[#6750a4]"
                  >
                    <option value="Gini">Gini</option>
                    <option value="Entropy">Entropy</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="block size-[18px]" fill="none" viewBox="0 0 12 7">
                      <path d={svgPaths.p4b63400} stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Max depth */}
              <div>
                <label className="font-['Poppins:Medium',sans-serif] text-[16px] text-black mb-2 block">
                  Max depth:
                </label>
                <input
                  type="text"
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(e.target.value)}
                  className="w-full h-[38px] px-4 rounded-[10px] border border-[#AAAAAA] font-['Poppins:Medium',sans-serif] text-[16px] text-black text-right focus:outline-none focus:border-[#6750a4]"
                />
                <p className="font-['Poppins:Light',sans-serif] text-[12px] text-[#a6a6a6] mt-1">
                  Leave empty for None
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Max features */}
              <div>
                <label className="font-['Poppins:Medium',sans-serif] text-[16px] text-black mb-2 block">
                  Max features:
                </label>
                <input
                  type="text"
                  value={maxFeatures}
                  onChange={(e) => setMaxFeatures(e.target.value)}
                  className="w-full h-[38px] px-4 rounded-[10px] border border-[#AAAAAA] font-['Poppins:Medium',sans-serif] text-[16px] text-black text-right focus:outline-none focus:border-[#6750a4]"
                />
                <p className="font-['Poppins:Light',sans-serif] text-[12px] text-[#a6a6a6] mt-1">
                  Learn more on sklearn document
                </p>
              </div>

              {/* Bootstrap */}
              <div className="col-start-3">
                <label className="font-['Poppins:Medium',sans-serif] text-[16px] text-black mb-2 block">
                  Bootstrap
                </label>
                <div className="flex items-center h-[38px] px-4 rounded-[10px] border border-[#AAAAAA]">
                  <Switch
                    checked={bootstrap}
                    onCheckedChange={setBootstrap}
                    className="ml-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleDelete}
              className="bg-[#dd4444] h-[56px] px-[14px] py-[6px] rounded-[14px] font-['Poppins:Medium',sans-serif] text-[20px] text-white hover:bg-[#dd4444]/90 transition-colors min-w-[107px]"
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              className="bg-[#44dd9e] h-[56px] px-[14px] py-[6px] rounded-[14px] font-['Poppins:Medium',sans-serif] text-[20px] text-white hover:bg-[#44dd9e]/90 transition-colors min-w-[107px]"
            >
              Save
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
