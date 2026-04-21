import React from "react";

const SectionCard = ({ icon: Icon, title, children, className = "" }) => (
  <div className={`bg-NavigationBackground border border-LineBox rounded-2xl p-6 ${className}`}>
    {(Icon || title) && (
      <div className="flex items-center gap-2 mb-5">
        {Icon && <Icon size={16} className="text-MainBlue" />}
        {title && (
          <h3 className="text-white font-jakarta font-bold text-lg">{title}</h3>
        )}
      </div>
    )}
    <div className="space-y-4">{children}</div>
  </div>
);

export default SectionCard;
