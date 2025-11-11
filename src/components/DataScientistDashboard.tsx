import React, { useEffect, useMemo, useState } from "react";
import { usePermissions } from "../contexts/PermissionsContext";
import svgPaths from "../imports/svg-24pp62cn5v";
import img from "figma:asset/b84a227f158a096d5fb31a5a5f2dd6c595e78767.png";
import imgImage1 from "figma:asset/5ce7c74a7b703322bab79cb35e6c6cd9197ba400.png";
import imgImage2 from "figma:asset/4d017917f435f0b47041e4f44e1c93ff6b274c6e.png";
import { ModelConfigDialog } from "./ModelConfigDialog";
import { NotificationPanel } from "./NotificationPanel";
import { extendedMockStudents } from "../data/mockStudentsExtended";
import { MentalHealthRecord, mockMentalHealthRecords } from "../data/mockMentalHealth";
import { dataScientistNotifications } from "../data/mockNotificationsByRole";
import { DatasetManagement } from "./DatasetManagementSection";
import { listModels, createModel, trainModel, deployModel, type MLModel } from "../services/mlModels";
import { listDatasets } from "../services/datasets";
import { toast } from "sonner";

interface DataScientistDashboardProps {
  onLogout: () => void;
}

type DashboardView = "dashboard" | "modelSettings";

function Welcome() {
  return (
    <div className="absolute box-border content-stretch flex gap-[9.863px] items-center leading-[0] left-[calc(16.667%+77.978px)] px-[4.11px] py-0 text-[#0c1e33] text-[19.727px] top-[123.29px] w-[350.97px]">
      <div className="flex flex-col font-['Rubik:Bold',sans-serif] justify-end relative shrink-0 size-[21.37px]">
        <p className="leading-[normal]">👋</p>
      </div>
      <div className="basis-0 capitalize flex flex-col font-['Poppins:Regular',sans-serif] grow justify-center min-h-px min-w-px not-italic relative shrink-0">
        <p className="leading-[normal]">Welcome, Data Scientist!</p>
      </div>
    </div>
  );
}

function Notification() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="notification">
        <path d={svgPaths.pddb2280} fill="var(--fill-0, #0C1E33)" id="Vector" />
        <path d={svgPaths.p628ea00} fill="var(--fill-0, #0C1E33)" id="Vector_2" />
      </g>
    </svg>
  );
}

interface HeaderProps {
  notifications: any[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

function Header({ notifications, onMarkAsRead, onDismiss }: HeaderProps) {
  return (
    <div className="absolute contents left-[calc(8.333%+143.84px)] top-[42.74px]">
      <div className="absolute bg-white h-[55.892px] left-[calc(8.333%+143.84px)] top-[42.74px] w-[1302.78px]">
        <div aria-hidden="true" className="absolute border-[0px_0px_0.822px] border-[rgba(206,216,229,0.97)] border-solid bottom-[-0.82px] left-0 pointer-events-none right-0 top-0" />
      </div>
      <div className="absolute content-stretch flex gap-[24.658px] items-center justify-end left-[calc(91.667%-17.622px)] top-[55.89px]">
        <NotificationPanel 
          notifications={notifications}
          onMarkAsRead={onMarkAsRead}
          onDismiss={onDismiss}
        />
        <div className="relative shrink-0 size-[29.59px]">
          <img alt="User avatar" className="block max-w-none size-full rounded-full" height="29.59" src={img} width="29.59" />
        </div>
      </div>
    </div>
  );
}

function ModelOverview({ onOpenConfig }: { onOpenConfig: () => void }) {
  return (
    <div className="absolute h-[193px] left-[calc(16.667%+83.978px)] top-[178px] w-[1149px]">
      <div className="absolute bg-[#f4f6f7] bottom-[-417.62%] left-0 right-0 rounded-[3.288px] top-0">
        <div aria-hidden="true" className="absolute border-[#f4f6f7] border-[0.822px] border-solid inset-[-0.822px] pointer-events-none rounded-[4.10994px]" />
      </div>
      
      <div className="absolute flex flex-col font-['Poppins:SemiBold',sans-serif] inset-[9.98%_36.91%_74.47%_1.72%] justify-center leading-[0] not-italic text-[#0c1e33] text-[19.727px]">
        <p className="leading-[normal]">Model Overview</p>
      </div>

      {/* Stats */}
      <div className="absolute content-stretch flex gap-[94px] items-center justify-center left-[20px] top-[66px] w-[656px]">
        <div className="content-stretch flex flex-col h-[51px] items-center leading-[normal] not-italic relative shrink-0 text-center w-[83px]">
          <p className="font-['Poppins:SemiBold',sans-serif] h-[21px] relative shrink-0 text-[#495d72] text-[14px] w-[131px]">Used Features</p>
          <p className="font-['Poppins:Bold',sans-serif] h-[23px] relative shrink-0 text-[#4c85e9] text-[20px] w-full">8</p>
        </div>
        
        <div className="content-stretch flex flex-col items-center justify-center leading-[normal] not-italic relative shrink-0 text-center w-[83px]">
          <p className="font-['Poppins:SemiBold',sans-serif] h-[21px] relative shrink-0 text-[#495d72] text-[14px] w-full">Class #1</p>
          <p className="font-['Poppins:Bold',sans-serif] relative shrink-0 text-[#4c85e9] text-[20px] w-[217px]">Stress (4)</p>
        </div>
        
        <div className="content-stretch flex flex-col items-center justify-center leading-[normal] not-italic relative shrink-0 text-center w-[83px]">
          <div className="font-['Poppins:SemiBold',sans-serif] h-[21px] relative shrink-0 text-[#495d72] text-[14px] w-full">
            <p className="mb-0">Class #2</p>
          </div>
          <p className="font-['Poppins:Bold',sans-serif] relative shrink-0 text-[#4c85e9] text-[20px] w-[217px]">Depression (5)</p>
        </div>
        
        <div className="content-stretch flex flex-col items-center justify-center leading-[normal] not-italic relative shrink-0 text-center w-[83px]">
          <p className="font-['Poppins:SemiBold',sans-serif] h-[21px] relative shrink-0 text-[#495d72] text-[14px] w-full">Class #3</p>
          <p className="font-['Poppins:Bold',sans-serif] relative shrink-0 text-[#4c85e9] text-[20px] w-[217px]">Anxiety (4)</p>
        </div>
      </div>

      {/* Re-Train Model Button */}
      <button 
        onClick={onOpenConfig}
        className="absolute bg-[#cb2740] box-border content-stretch flex gap-[9.863px] inset-[69.18%_86.98%_10.24%_1.72%] items-center justify-center px-[13.151px] py-[9.863px] rounded-[3.288px] hover:bg-[#cb2740]/90 transition-colors"
      >
        <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13.151px] text-nowrap text-white">
          <p className="leading-[normal] whitespace-pre">Re-Train Model</p>
        </div>
      </button>

      {/* Model Accuracy */}
      <div className="absolute contents leading-[0] left-[977px] not-italic text-center top-[55px]">
        <div className="absolute flex flex-col font-['Poppins:SemiBold',sans-serif] inset-[28.5%_3.22%_34.2%_85.29%] justify-center text-[#659756] text-[48px]">
          <p className="leading-[normal]">91,2%</p>
        </div>
        <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center left-[1044.5px] text-[#495d72] text-[11px] text-nowrap top-[133.5px] translate-x-[-50%] translate-y-[-50%]">
          <p className="leading-[normal] whitespace-pre">Current Model Accuracy</p>
        </div>
      </div>

      {/* Divider */}
      <div className="absolute bottom-0 left-[1.22%] right-[2%] top-full">
        <div className="absolute inset-[-0.41px_-0.04%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1113 1">
            <path d="M0.410972 0.410972H1112.41" stroke="#C9C9C9" strokeLinecap="round" strokeWidth="0.821944" />
          </svg>
        </div>
      </div>

      {/* Config Dropdown */}
      <div className="absolute contents left-[169px] top-[135px]">
        <div className="absolute h-[39px] left-[169px] rounded-[10px] top-[135px] w-[191px]">
          <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[10px]" />
        </div>
        <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[180px] not-italic text-[13.151px] text-black text-nowrap top-[155px] translate-y-[-50%]">
          <p className="leading-[normal] whitespace-pre">My First Config</p>
        </div>
        <div className="absolute left-[336px] overflow-clip size-[18px] top-[147px]">
          <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]">
            <div className="absolute inset-[-27.78%_-13.89%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 7">
                <path d={svgPaths.p4b63400} stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Icon */}
      <button 
        onClick={onOpenConfig}
        className="absolute left-[372px] overflow-clip size-[24px] top-[143px] cursor-pointer hover:opacity-70 transition-opacity"
      >
        <div className="absolute inset-[7.83%_7.83%_8.33%_8.33%]">
          <div className="absolute inset-[-7.455%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d={svgPaths.pd40ed00} stroke="#0088FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </svg>
          </div>
        </div>
      </button>

      {/* Confusion Matrices */}
      <div className="absolute content-stretch flex items-start justify-between left-[12px] top-[218px] w-[1075px]">
        <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 w-[258px]">
          <div className="aspect-[764/620] pointer-events-none relative rounded-[14px] shrink-0 w-full">
            <img alt="Stress confusion matrix" className="absolute inset-0 max-w-none object-50%-50% object-cover rounded-[14px] size-full" src={imgImage1} />
            <div aria-hidden="true" className="absolute border border-[#bfbfbf] border-solid inset-0 rounded-[14px]" />
          </div>
          <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13.151px] text-black text-center w-full">
            <p className="leading-[normal]">Stress confusion matrix</p>
          </div>
        </div>

        <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 w-[258px]">
          <div className="aspect-[764/620] pointer-events-none relative rounded-[14px] shrink-0 w-full">
            <img alt="Depression confusion matrix" className="absolute inset-0 max-w-none object-50%-50% object-cover rounded-[14px] size-full" src={imgImage1} />
            <div aria-hidden="true" className="absolute border border-[#bfbfbf] border-solid inset-0 rounded-[14px]" />
          </div>
          <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13.151px] text-black text-center w-full">
            <p className="leading-[normal]">Depression confusion matrix</p>
          </div>
        </div>

        <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 w-[258px]">
          <div className="aspect-[764/620] pointer-events-none relative rounded-[14px] shrink-0 w-full">
            <img alt="Anxiety confusion matrix" className="absolute inset-0 max-w-none object-50%-50% object-cover rounded-[14px] size-full" src={imgImage1} />
            <div aria-hidden="true" className="absolute border border-[#bfbfbf] border-solid inset-0 rounded-[14px]" />
          </div>
          <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13.151px] text-black text-center w-full">
            <p className="leading-[normal]">Anxiety confusion matrix</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ onLogout, currentView, onNavigate }: { onLogout: () => void; currentView: DashboardView; onNavigate: (view: DashboardView) => void }) {
  return (
    <div className="fixed h-full left-0 top-0 w-[275.351px] bg-[#0c1e33] z-50">
      {/* Logo */}
      <div className="absolute box-border content-stretch flex gap-[4.932px] inset-[5%_8.96%_92.35%_17.91%] items-center p-[4.932px] rounded-[9.863px]">
        <div className="relative shrink-0 size-[17.261px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <path d={svgPaths.p8fcdd00} fill="white" />
            <path d={svgPaths.p147ecfb0} fill="white" />
          </svg>
        </div>
        <div className="capitalize flex flex-col font-['Alumni_Sans_Inline_One:Regular',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-white w-[118px]">
          <p className="leading-[normal]">Scientist Space</p>
        </div>
      </div>

      {/* Divider 1 */}
      <div className="absolute bottom-[80.58%] left-0 right-0 top-[19.42%]">
        <div className="absolute inset-[-0.41px_-0.15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 277 1">
            <path d="M0.410972 0.410972H275.762" opacity="0.48" stroke="white" strokeLinecap="round" strokeWidth="0.821944" />
          </svg>
        </div>
      </div>

      {/* Divider 2 */}
      <div className="absolute bottom-[91.18%] left-0 right-0 top-[8.82%]">
        <div className="absolute inset-[-0.41px_-0.15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 277 1">
            <path d="M0.410972 0.410972H275.762" opacity="0.48" stroke="white" strokeLinecap="round" strokeWidth="0.821944" />
          </svg>
        </div>
      </div>

      {/* Dashboard Button */}
      <button
        onClick={() => onNavigate("dashboard")}
        className={`absolute box-border content-stretch flex gap-[9.863px] h-[39.453px] items-center left-[47px] overflow-clip px-[13.151px] py-[9.863px] rounded-[4.932px] top-[123px] w-[201.376px] cursor-pointer hover:bg-white/10 transition-colors ${
          currentView === "dashboard" ? "bg-gradient-to-r from-[8.571%] from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0)] rounded-bl-[4.932px] rounded-tl-[4.932px]" : ""
        }`}
      >
        {currentView === "dashboard" && <div aria-hidden="true" className="absolute border-[0px_0px_0px_4.932px] border-solid border-white inset-0 pointer-events-none rounded-bl-[4.932px] rounded-tl-[4.932px]" />}
        <div className="relative shrink-0 size-[19.727px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p16a2c600} fill="white" />
            <path d={svgPaths.p2e95ef80} fill="white" />
            <path d={svgPaths.p2d8edc00} fill="white" />
            <path d={svgPaths.p15dc2100} fill="white" />
          </svg>
        </div>
        <div className="basis-0 capitalize flex flex-col font-['Poppins:SemiBold',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[11.507px] text-white">
          <p className="leading-[normal]">Dashboard</p>
        </div>
      </button>

      {/* Model Settings Button */}
      <button
        onClick={() => onNavigate("modelSettings")}
        className={`absolute box-border content-stretch flex gap-[9.863px] h-[39.453px] items-center left-[47px] overflow-clip px-[13.151px] py-[9.863px] rounded-[4.932px] top-[166px] w-[201.376px] cursor-pointer hover:bg-white/10 transition-colors ${
          currentView === "modelSettings" ? "bg-gradient-to-r from-[8.571%] from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0)] rounded-bl-[4.932px] rounded-tl-[4.932px]" : ""
        }`}
      >
        {currentView === "modelSettings" && <div aria-hidden="true" className="absolute border-[0px_0px_0px_4.932px] border-solid border-white inset-0 pointer-events-none rounded-bl-[4.932px] rounded-tl-[4.932px]" />}
        <div className="relative shrink-0 size-[19.727px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p37842780} fill="white" />
          </svg>
        </div>
        <div className="basis-0 capitalize flex flex-col font-['Poppins:SemiBold',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[11.507px] text-white">
          <p className="leading-[normal]">Model Settings</p>
        </div>
      </button>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="absolute box-border content-stretch flex gap-[9.863px] h-[39.453px] items-center left-[47px] overflow-clip px-[13.151px] py-[9.863px] top-[234.05px] w-[201.376px] hover:bg-white/10 transition-colors cursor-pointer"
      >
        <div className="relative shrink-0 size-[19.727px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p37611800} fill="white" />
            <path d={svgPaths.p28a1ad00} fill="white" />
          </svg>
        </div>
        <div className="basis-0 capitalize flex flex-col font-['Poppins:Medium',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[11.507px] text-white">
          <p className="leading-[normal]">logout</p>
        </div>
      </button>

      {/* Help Button */}
      <div className="absolute box-border content-stretch flex gap-[9.863px] h-[39.453px] items-center left-[47px] overflow-clip px-[13.151px] py-[9.863px] top-[272.05px] w-[201.376px]">
        <div className="h-[20px] overflow-clip relative shrink-0 w-[19px]">
          <div className="absolute inset-[8.333%]">
            <div className="absolute inset-[-12%_-12.63%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 21">
                <path d={svgPaths.p1d4468f0} stroke="#D9D9D9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="basis-0 capitalize flex flex-col font-['Poppins:Medium',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[11.507px] text-white">
          <p className="leading-[normal]">help</p>
        </div>
      </div>
    </div>
  );
}

function ModelSettings() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="font-['Poppins:SemiBold',sans-serif] text-[24px] text-[#0c1e33] mb-4">
          Model Settings
        </h2>
        <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#495d72]">
          Configure your machine learning model parameters and training settings.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Configuration */}
        <div className="bg-[#f4f6f7] p-6 rounded-[8px]">
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#0c1e33] mb-4">
            Model Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72] block mb-2">
                Algorithm
              </label>
              <select className="w-full bg-white border border-[#d0d0d0] rounded-[6px] px-4 py-2 font-['Poppins:Regular',sans-serif] text-[13px]">
                <option>Random Forest</option>
                <option>Neural Network</option>
                <option>Gradient Boosting</option>
              </select>
            </div>
            <div>
              <label className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72] block mb-2">
                Number of Features
              </label>
              <input
                type="number"
                defaultValue="8"
                className="w-full bg-white border border-[#d0d0d0] rounded-[6px] px-4 py-2 font-['Poppins:Regular',sans-serif] text-[13px]"
              />
            </div>
          </div>
        </div>

        {/* Training Parameters */}
        <div className="bg-[#f4f6f7] p-6 rounded-[8px]">
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#0c1e33] mb-4">
            Training Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72] block mb-2">
                Learning Rate
              </label>
              <input
                type="number"
                step="0.001"
                defaultValue="0.001"
                className="w-full bg-white border border-[#d0d0d0] rounded-[6px] px-4 py-2 font-['Poppins:Regular',sans-serif] text-[13px]"
              />
            </div>
            <div>
              <label className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72] block mb-2">
                Epochs
              </label>
              <input
                type="number"
                defaultValue="100"
                className="w-full bg-white border border-[#d0d0d0] rounded-[6px] px-4 py-2 font-['Poppins:Regular',sans-serif] text-[13px]"
              />
            </div>
          </div>
        </div>

        {/* Data Processing */}
        <div className="bg-[#f4f6f7] p-6 rounded-[8px]">
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#0c1e33] mb-4">
            Data Processing
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="normalize"
                defaultChecked
                className="mr-3"
              />
              <label htmlFor="normalize" className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72]">
                Normalize Data
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="balance"
                defaultChecked
                className="mr-3"
              />
              <label htmlFor="balance" className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72]">
                Balance Classes
              </label>
            </div>
          </div>
        </div>

        {/* Validation */}
        <div className="bg-[#f4f6f7] p-6 rounded-[8px]">
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#0c1e33] mb-4">
            Validation
          </h3>
          <div className="space-y-4">
            <div>
              <label className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72] block mb-2">
                Validation Split
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                defaultValue="0.2"
                className="w-full bg-white border border-[#d0d0d0] rounded-[6px] px-4 py-2 font-['Poppins:Regular',sans-serif] text-[13px]"
              />
            </div>
            <div>
              <label className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72] block mb-2">
                Cross-Validation Folds
              </label>
              <input
                type="number"
                defaultValue="5"
                className="w-full bg-white border border-[#d0d0d0] rounded-[6px] px-4 py-2 font-['Poppins:Regular',sans-serif] text-[13px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <button className="bg-[#0c1e33] text-white px-6 py-3 rounded-[6px] font-['Poppins:Medium',sans-serif] text-[13px] hover:bg-[#1a2f4a] transition-colors">
          Save Settings
        </button>
        <button className="bg-[#cb2740] text-white px-6 py-3 rounded-[6px] font-['Poppins:Medium',sans-serif] text-[13px] hover:bg-[#cb2740]/90 transition-colors">
          Train Model
        </button>
      </div>
    </div>
  );
}

function AnalyticsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  
  // Calculate statistics from mock data
  const totalStudents = extendedMockStudents.length;
  const highRisk = mockMentalHealthRecords.filter(r => r.riskLevel === "high").length;
  const moderateRisk = mockMentalHealthRecords.filter(r => r.riskLevel === "moderate").length;
  const lowRisk = mockMentalHealthRecords.filter(r => r.riskLevel === "low").length;
  
  const avgStress = (mockMentalHealthRecords.reduce((sum, r) => sum + r.stressLevel, 0) / totalStudents).toFixed(1);
  const avgSleep = (mockMentalHealthRecords.reduce((sum, r) => sum + r.sleepHours, 0) / totalStudents).toFixed(1);

  // Student data for table - with all fields
  interface StudentDataRow {
    studentId: string;
    studentName: string;
    age: number;
    course: string;
    stressLevel: number;
    moodRating: number;
    sleepHours: number;
    counselingSessions: number;
    riskLevel: string;
    depressionScore: number;
    anxietyScore: number;
    sleepQuality: string;
    physicalActivity: string;
    dietQuality: string;
    socialSupport: number;
    substanceUse: string;
    familyHistory: string;
    chronicIllness: string;
    financialStress: number;
    semesterCreditLoad: number;
    lastCheckIn: string;
    notes: string;
    prediction: string;
  }

  const studentData: StudentDataRow[] = extendedMockStudents.map((student) => {
    const mentalHealth = mockMentalHealthRecords.find((record) => record.id === student.id);
    
    return {
      studentId: student.studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      age: mentalHealth?.age || 20,
      course: student.major,
      stressLevel: mentalHealth?.stressLevel || 0,
      moodRating: mentalHealth?.moodRating || 3,
      sleepHours: mentalHealth?.sleepHours || 7,
      counselingSessions: mentalHealth?.counselingSessions || 0,
      riskLevel: mentalHealth?.riskLevel === "high" ? "High" : 
                 mentalHealth?.riskLevel === "moderate" ? "Medium" : "Low",
      depressionScore: mentalHealth?.depressionScore || 0,
      anxietyScore: mentalHealth?.anxietyScore || 0,
      sleepQuality: mentalHealth?.sleepQuality || "Good",
      physicalActivity: mentalHealth?.physicalActivity || "Moderate",
      dietQuality: mentalHealth?.dietQuality || "Good",
      socialSupport: mentalHealth?.socialSupport || 3,
      substanceUse: mentalHealth?.substanceUse || "Never",
      familyHistory: mentalHealth?.familyHistory || "No",
      chronicIllness: mentalHealth?.chronicIllness || "No",
      financialStress: mentalHealth?.financialStress || 2,
      semesterCreditLoad: mentalHealth?.semesterCreditLoad || 15,
      lastCheckIn: mentalHealth?.lastCheckIn || "N/A",
      notes: mentalHealth?.notes || "No notes available",
      prediction: mentalHealth?.riskLevel === "high" ? "Stress" : 
                  mentalHealth?.riskLevel === "moderate" ? "Anxiety" : "Normal",
    };
  });

  const filteredStudents = studentData.filter((student) =>
    student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

  return (
    <div className="absolute left-[calc(16.667%+77.978px)] top-[178px] w-[1200px]">
      {/* Model Performance Metrics */}
      <div className="absolute bg-[#f4f6f7] rounded-[8px] p-[24px] top-0 w-full">
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-[19.727px]">
            <p>Model Performance Analytics</p>
          </div>
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-[20px] mt-[16px]">
            {/* Accuracy */}
            <div className="bg-white rounded-[8px] p-[20px] flex flex-col items-center">
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[12px] mb-[8px]">Accuracy</p>
              <p className="font-['Poppins:Bold',sans-serif] text-[#4c85e9] text-[28px]">94.2%</p>
              <div className="mt-[8px] w-full h-[4px] bg-[#e5e5e5] rounded-full overflow-hidden">
                <div className="h-full bg-[#4c85e9] w-[94.2%]"></div>
              </div>
            </div>

            {/* Precision */}
            <div className="bg-white rounded-[8px] p-[20px] flex flex-col items-center">
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[12px] mb-[8px]">Precision</p>
              <p className="font-['Poppins:Bold',sans-serif] text-[#27ae60] text-[28px]">91.8%</p>
              <div className="mt-[8px] w-full h-[4px] bg-[#e5e5e5] rounded-full overflow-hidden">
                <div className="h-full bg-[#27ae60] w-[91.8%]"></div>
              </div>
            </div>

            {/* Recall */}
            <div className="bg-white rounded-[8px] p-[20px] flex flex-col items-center">
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[12px] mb-[8px]">Recall</p>
              <p className="font-['Poppins:Bold',sans-serif] text-[#f2994a] text-[28px]">89.5%</p>
              <div className="mt-[8px] w-full h-[4px] bg-[#e5e5e5] rounded-full overflow-hidden">
                <div className="h-full bg-[#f2994a] w-[89.5%]"></div>
              </div>
            </div>

            {/* F1 Score */}
            <div className="bg-white rounded-[8px] p-[20px] flex flex-col items-center">
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[12px] mb-[8px]">F1 Score</p>
              <p className="font-['Poppins:Bold',sans-serif] text-[#9b51e0] text-[28px]">90.6%</p>
              <div className="mt-[8px] w-full h-[4px] bg-[#e5e5e5] rounded-full overflow-hidden">
                <div className="h-full bg-[#9b51e0] w-[90.6%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="absolute bg-white rounded-[8px] p-[24px] top-[200px] w-[580px]">
        <div className="flex flex-col gap-[16px]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-[16px]">Risk Distribution</p>
          
          <div className="flex flex-col gap-[12px] mt-[8px]">
            {/* High Risk */}
            <div className="flex items-center gap-[12px]">
              <div className="w-[100px] font-['Poppins:Medium',sans-serif] text-[#495d72] text-[12px]">High Risk</div>
              <div className="flex-1 h-[28px] bg-[#f4f6f7] rounded-[4px] overflow-hidden relative">
                <div className="h-full bg-[#eb5757] transition-all" style={{ width: `${(highRisk / totalStudents) * 100}%` }}></div>
              </div>
              <div className="w-[60px] text-right font-['Poppins:Bold',sans-serif] text-[#eb5757] text-[14px]">{highRisk} ({Math.round((highRisk / totalStudents) * 100)}%)</div>
            </div>

            {/* Moderate Risk */}
            <div className="flex items-center gap-[12px]">
              <div className="w-[100px] font-['Poppins:Medium',sans-serif] text-[#495d72] text-[12px]">Moderate Risk</div>
              <div className="flex-1 h-[28px] bg-[#f4f6f7] rounded-[4px] overflow-hidden relative">
                <div className="h-full bg-[#f2994a] transition-all" style={{ width: `${(moderateRisk / totalStudents) * 100}%` }}></div>
              </div>
              <div className="w-[60px] text-right font-['Poppins:Bold',sans-serif] text-[#f2994a] text-[14px]">{moderateRisk} ({Math.round((moderateRisk / totalStudents) * 100)}%)</div>
            </div>

            {/* Low Risk */}
            <div className="flex items-center gap-[12px]">
              <div className="w-[100px] font-['Poppins:Medium',sans-serif] text-[#495d72] text-[12px]">Low Risk</div>
              <div className="flex-1 h-[28px] bg-[#f4f6f7] rounded-[4px] overflow-hidden relative">
                <div className="h-full bg-[#27ae60] transition-all" style={{ width: `${(lowRisk / totalStudents) * 100}%` }}></div>
              </div>
              <div className="w-[60px] text-right font-['Poppins:Bold',sans-serif] text-[#27ae60] text-[14px]">{lowRisk} ({Math.round((lowRisk / totalStudents) * 100)}%)</div>
            </div>
          </div>

          <div className="mt-[16px] pt-[16px] border-t border-[#e5e5e5]">
            <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px]">Total Students Analyzed: <span className="font-['Poppins:Bold',sans-serif] text-[#0c1e33]">{totalStudents}</span></p>
          </div>
        </div>
      </div>

      {/* Dataset Statistics */}
      <div className="absolute bg-white rounded-[8px] p-[24px] top-[200px] left-[600px] w-[600px]">
        <div className="flex flex-col gap-[16px]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-[16px]">Dataset Statistics</p>
          
          <div className="grid grid-cols-2 gap-[16px] mt-[8px]">
            <div className="bg-[#f4f6f7] rounded-[8px] p-[16px]">
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px] mb-[4px]">Avg Stress Level</p>
              <p className="font-['Poppins:Bold',sans-serif] text-[#0c1e33] text-[24px]">{avgStress}/10</p>
            </div>
            
            <div className="bg-[#f4f6f7] rounded-[8px] p-[16px]">
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px] mb-[4px]">Avg Sleep Hours</p>
              <p className="font-['Poppins:Bold',sans-serif] text-[#0c1e33] text-[24px]">{avgSleep}h</p>
            </div>

            <div className="bg-[#f4f6f7] rounded-[8px] p-[16px]">
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px] mb-[4px]">Features Used</p>
              <p className="font-['Poppins:Bold',sans-serif] text-[#0c1e33] text-[24px]">8</p>
            </div>

            <div className="bg-[#f4f6f7] rounded-[8px] p-[16px]">
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px] mb-[4px]">Model Version</p>
              <p className="font-['Poppins:Bold',sans-serif] text-[#0c1e33] text-[24px]">v2.1</p>
            </div>
          </div>

          <div className="mt-[8px] bg-[#e8f4fd] rounded-[8px] p-[12px] border border-[#4c85e9]/20">
            <p className="font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[11px]">
              <span className="font-['Poppins:Bold',sans-serif]">Last Training:</span> Nov 1, 2025 14:30
            </p>
            <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[10px] mt-[4px]">
              Training Time: 2.4 minutes • Samples: {totalStudents}
            </p>
          </div>
        </div>
      </div>

      {/* Top Features */}
      <div className="absolute bg-[#f4f6f7] rounded-[8px] p-[24px] top-[490px] w-full">
        <div className="flex flex-col gap-[12px]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-[16px]">Top Feature Importance</p>
          
          <div className="grid grid-cols-4 gap-[16px] mt-[8px]">
            {[
              { name: 'Sleep Hours', value: 0.28, color: '#4c85e9' },
              { name: 'Stress Level', value: 0.24, color: '#eb5757' },
              { name: 'Study Hours', value: 0.18, color: '#f2994a' },
              { name: 'Social Activity', value: 0.12, color: '#27ae60' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-[8px] p-[16px] flex flex-col">
                <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px] mb-[8px]">{feature.name}</p>
                <p className="font-['Poppins:Bold',sans-serif] text-[20px] mb-[8px]" style={{ color: feature.color }}>
                  {(feature.value * 100).toFixed(0)}%
                </p>
                <div className="w-full h-[6px] bg-[#e5e5e5] rounded-full overflow-hidden">
                  <div className="h-full transition-all" style={{ width: `${feature.value * 100}%`, backgroundColor: feature.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student List Section */}
      <div className="absolute bg-white rounded-[8px] p-[24px] top-[670px] w-full">
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <div className="relative shrink-0 size-[20px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <path d={svgPaths.p2a321e00} fill="#0C1E33" />
                  <path d={svgPaths.p1e977b80} fill="#0C1E33" />
                </svg>
              </div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-[16px]">Student Data Records</p>
              <span className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[12px]">({filteredStudents.length} students)</span>
            </div>
            
            {/* Search */}
            <div className="bg-[#f5f6f8] box-border content-stretch flex gap-[9.863px] h-[32px] items-center px-[13.151px] py-[4.932px] rounded-[4.932px] w-[300px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name or ID..."
                className="flex-1 bg-transparent border-none outline-none text-[11.507px] font-['Poppins:Medium',sans-serif] text-[#495d72] placeholder:text-[rgba(73,93,114,0.6)]"
              />
              <div className="relative shrink-0 size-[16px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <path d={svgPaths.p246ea500} fill="#495D72" />
                  <path d={svgPaths.p3f321470} fill="#495D72" />
                </svg>
              </div>
            </div>
          </div>

          {/* Table with All Fields */}
          <div className="mt-[8px] overflow-x-auto rounded-[4px] border border-[#e5e5e5]">
            <table className="w-full min-w-[2600px]">
              <thead>
                <tr className="border-b border-[#e5e5e5] bg-[#f9fafb]">
                  <th className="text-left py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Student Name</th>
                  <th className="text-left py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Student ID</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Age</th>
                  <th className="text-left py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Course</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Stress Level</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Mood Rating</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Sleep Hours</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Counseling Sessions</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Risk Level</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Depression Score</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Anxiety Score</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Sleep Quality</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Physical Activity</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Diet Quality</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Social Support</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Substance Use</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Family History</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Chronic Illness</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Financial Stress</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Credit Load</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Last Check-In</th>
                  <th className="text-center py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Prediction</th>
                  <th className="text-left py-[12px] px-[8px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Notes</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((student, idx) => (
                  <tr key={student.studentId} className={idx % 2 === 0 ? "bg-[#f9fafb]" : "bg-white"}>
                    <td className="py-[10px] px-[8px] font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[11px] whitespace-nowrap">{student.studentName}</td>
                    <td className="py-[10px] px-[8px] font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">{student.studentId}</td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{student.age}</td>
                    <td className="py-[10px] px-[8px] font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">{student.course}</td>
                    <td className="py-[10px] px-[8px] text-center">
                      <span className={`font-['Poppins:SemiBold',sans-serif] text-[11px] px-[8px] py-[2px] rounded-[4px] ${
                        student.stressLevel >= 4 ? 'bg-[#eb5757]/10 text-[#eb5757]' :
                        student.stressLevel >= 3 ? 'bg-[#f2994a]/10 text-[#f2994a]' :
                        'bg-[#27ae60]/10 text-[#27ae60]'
                      }`}>
                        {student.stressLevel}/5
                      </span>
                    </td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{student.moodRating}/5</td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{student.sleepHours}h</td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{student.counselingSessions}</td>
                    <td className="py-[10px] px-[8px] text-center">
                      <span className={`font-['Poppins:SemiBold',sans-serif] text-[11px] capitalize ${
                        student.riskLevel === "High" ? "text-[#eb5757]" :
                        student.riskLevel === "Medium" ? "text-[#f2994a]" :
                        "text-[#27ae60]"
                      }`}>
                        {student.riskLevel}
                      </span>
                    </td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{student.depressionScore}/5</td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{student.anxietyScore}/5</td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">{student.sleepQuality}</td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">{student.physicalActivity}</td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">{student.dietQuality}</td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{student.socialSupport}/5</td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">{student.substanceUse}</td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px]">{student.familyHistory}</td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px]">{student.chronicIllness}</td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{student.financialStress}/5</td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{student.semesterCreditLoad}</td>
                    <td className="py-[10px] px-[8px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">{student.lastCheckIn}</td>
                    <td className="py-[10px] px-[8px] text-center">
                      <span className="font-['Poppins:Medium',sans-serif] text-[11px] px-[10px] py-[4px] rounded-[6px] bg-[#4c85e9]/10 text-[#4c85e9]">
                        {student.prediction}
                      </span>
                    </td>
                    <td className="py-[10px] px-[8px] font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] max-w-[200px] truncate" title={student.notes}>{student.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-[16px] pt-[16px] border-t border-[#e5e5e5]">
            <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px]">
              Showing {startIndex + 1}-{Math.min(startIndex + studentsPerPage, filteredStudents.length)} of {filteredStudents.length} students
            </p>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-[#0c1e33] text-white text-[11px] font-['Poppins:Medium',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1a2f4a] transition-colors"
              >
                Previous
              </button>
              <span className="text-[11px] text-[#495d72] font-['Poppins:Regular',sans-serif]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-[#0c1e33] text-white text-[11px] font-['Poppins:Medium',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1a2f4a] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DataScientistDashboard({ onLogout }: DataScientistDashboardProps) {
  const [currentView, setCurrentView] = useState<DashboardView>("modelSettings");
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState(dataScientistNotifications);
  const { hasPermission } = usePermissions();
  const [models, setModels] = useState<MLModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  async function reloadModels() {
    try {
      setIsLoadingModels(true);
      const res = await listModels({ page: 1, limit: 20, order: "desc", sortBy: "updatedAt" });
      setModels(res.items ?? []);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load models");
    } finally {
      setIsLoadingModels(false);
    }
  }

  useEffect(() => {
    if (hasPermission("mlModels.manage")) {
      reloadModels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPermission]);

  const latestTrained = useMemo(() => {
    return models.find(m => m.status === "deployed" || m.status === "trained") ?? models[0];
  }, [models]);

  async function handleRetrainFromConfig(config: {
    configName: string;
    trainTestRatio: number;
    hyperparameters: Record<string, any>;
    selectedFeatures: Record<string, boolean>;
  }) {
    try {
      const dsList = await listDatasets({ page: 1, limit: 1, order: "desc", sortBy: "uploadedAt" });
      const latestDataset = dsList.items?.[0];
      if (!latestDataset) {
        toast.error("No dataset available. Please upload a dataset first.");
        return;
      }
      const features = Object.entries(config.selectedFeatures)
        .filter(([, v]) => v)
        .map(([k]) => k);
      const created = await createModel({
        modelName: config.configName,
        modelType: "classification",
        algorithm: "RandomForest",
        features,
        targetVariable: "riskLevel",
        hyperparameters: config.hyperparameters
      } as any);
      await trainModel(created.id, {
        datasetId: latestDataset.id,
        trainTestSplit: config.trainTestRatio / 100,
        hyperparameters: config.hyperparameters,
        features,
        targetVariable: "riskLevel"
      });
      toast.success("Training started/completed");
      await reloadModels();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to train model");
    }
  }

  async function handleDeployLatest() {
    try {
      const candidate = latestTrained;
      if (!candidate) {
        toast.error("No model available to deploy.");
        return;
      }
      await deployModel(candidate.id);
      toast.success("Model deployed");
      await reloadModels();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to deploy model");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar onLogout={onLogout} currentView={currentView} onNavigate={setCurrentView} />
      
      {currentView === "modelSettings" ? (
        <div className="ml-[275.351px] relative min-h-screen pb-[1600px]">
          <Welcome />
          <Header 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDismiss={handleDismiss}
          />
          <ModelOverview onOpenConfig={() => hasPermission("mlModels.manage") && setIsConfigDialogOpen(true)} />
          {hasPermission("mlModels.manage") && (
            <div className="absolute left-[calc(16.667%+83.978px)] top-[390px]">
              <button
                onClick={handleDeployLatest}
                disabled={isLoadingModels || !latestTrained}
                className="px-3 py-2 rounded bg-[#0c1e33] text-white text-sm disabled:opacity-60"
              >
                {isLoadingModels ? "Loading..." : "Deploy Latest"}
              </button>
            </div>
          )}
          
          <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(91.667%+8.878px)] not-italic text-[#495d72] text-[8.219px] text-center text-nowrap top-[146.55px] translate-x-[-50%] translate-y-[-50%]">
            <p className="leading-[normal] whitespace-pre">9 Nov 2025, Sunday</p>
          </div>

          {/* Feature Importance Chart */}
          <div className="absolute h-[462px] left-[calc(25%+94.467px)] top-[656px] w-[816px]">
            <img alt="Feature importances" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage2} />
          </div>

          {/* Dataset Management Section */}
          {hasPermission("datasets.manage") && <DatasetManagement />}
        </div>
      ) : currentView === "dashboard" ? (
        <div className="ml-[275.351px] relative min-h-screen pb-[600px]">
          <Welcome />
          <Header 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDismiss={handleDismiss}
          />
          <AnalyticsDashboard />
          
          <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(91.667%+8.878px)] not-italic text-[#495d72] text-[8.219px] text-center text-nowrap top-[146.55px] translate-x-[-50%] translate-y-[-50%]">
            <p className="leading-[normal] whitespace-pre">4 Nov 2025, Tuesday</p>
          </div>
        </div>
      ) : null}

      {/* Model Configuration Dialog */}
      <ModelConfigDialog 
        open={isConfigDialogOpen}
        onSave={handleRetrainFromConfig}
        onOpenChange={setIsConfigDialogOpen}
      />
    </div>
  );
}
