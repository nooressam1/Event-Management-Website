import React, { useRef } from "react";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import TemplateModern from "./flyer/TemplateModern";
import TemplateBold from "./flyer/TemplateBold";
import TemplateElegant from "./flyer/TemplateElegant";
import TemplateNeon from "./flyer/TemplateNeon";
import TemplateMinimal from "./flyer/TemplateMinimal";

const TEMPLATES = [
  { id: "modern",  label: "Modern"  },
  { id: "bold",    label: "Bold"    },
  { id: "elegant", label: "Elegant" },
  { id: "neon",    label: "Neon"    },
  { id: "minimal", label: "Minimal" },
];

const TEMPLATE_MAP = {
  modern:  TemplateModern,
  bold:    TemplateBold,
  elegant: TemplateElegant,
  neon:    TemplateNeon,
  minimal: TemplateMinimal,
};

const FlyerPreview = ({ fields, template, onTemplateChange, eventTitle }) => {
  const flyerRef = useRef(null);
  const TemplateComponent = TEMPLATE_MAP[template] ?? TemplateModern;

  const handleExport = async () => {
    if (!flyerRef.current) return;
    try {
      const canvas = await html2canvas(flyerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `${eventTitle || "flyer"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Template switcher + export */}
      <div className="flex flex-wrap items-center gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onTemplateChange(t.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              template === t.id
                ? "bg-MainBlue border-MainBlue text-white"
                : "border-LineBox text-SecondOffWhiteText hover:text-white hover:border-MainBlue/40"
            }`}
          >
            {t.label}
          </button>
        ))}

        <button
          onClick={handleExport}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-NavigationBackground border border-LineBox text-SecondOffWhiteText hover:text-white hover:border-MainBlue/40 transition-colors"
        >
          <Download size={14} />
          Export PNG
        </button>
      </div>

      {/* Preview wrapper — scales flyer to fit container */}
      {/* Inner div is 560×400 scaled to 75% → visual size 420×300, so set container height to 300+padding */}
      <div className="overflow-hidden rounded-xl border border-LineBox bg-MainBackground flex items-start justify-center p-4" style={{ height: "332px" }}>
        <div
          style={{
            transform: "scale(0.75)",
            transformOrigin: "top center",
            width: "560px",
            height: "400px",
            flexShrink: 0,
          }}
        >
          <TemplateComponent ref={flyerRef} {...fields} />
        </div>
      </div>

      <p className="text-xs text-SecondOffWhiteText text-center -mt-1">
        Preview is scaled for display — exported PNG is full resolution.
      </p>
    </div>
  );
};

export default FlyerPreview;
