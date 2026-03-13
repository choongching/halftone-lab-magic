import { TopToolbar } from "@/components/TopToolbar";
import { ControlPanel } from "@/components/ControlPanel";
import { PreviewStage } from "@/components/PreviewStage";

const Index = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopToolbar />
      <div className="flex flex-1 overflow-hidden">
        <ControlPanel />
        <div className="flex-1 overflow-hidden">
          <PreviewStage />
        </div>
      </div>
    </div>
  );
};

export default Index;
