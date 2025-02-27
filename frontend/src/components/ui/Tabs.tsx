import { Tab } from "@/types";
import { useState } from "react";

type TabsProps = {
  tabs: Tab[];
  onChangeTabs: (value: string) => void;
};

const Tabs = ({ tabs, onChangeTabs }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const onClickTab = (value: Tab) => {
    setActiveTab(value);
    onChangeTabs(value);
  };

  return (
    <div className="bg-turquoise-800 font-bold rounded-xl flex gap-1 overflow-hidden w-full">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`py-1.5 flex-1 rounded-lg relative z-10 text-turquoise-100 cursor-pointer ${
            activeTab === tab
              ? "font-bold bg-turquoise-100 transition-transform duration-300 text-turquoise-950"
              : ""
          }`}
          onClick={() => {
            onClickTab(tab);
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
