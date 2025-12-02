import svgPaths from "./svg-xhq8bqqtxc";
import img from "figma:asset/b84a227f158a096d5fb31a5a5f2dd6c595e78767.png";
import imgImage1 from "figma:asset/5ce7c74a7b703322bab79cb35e6c6cd9197ba400.png";
import imgImage2 from "figma:asset/4d017917f435f0b47041e4f44e1c93ff6b274c6e.png";

function Welcome() {
  return (
    <div className="absolute box-border content-stretch flex gap-[9.863px] items-center leading-[0] left-[calc(16.667%+77.978px)] px-[4.11px] py-0 text-[#0c1e33] text-[19.727px] top-[123.29px] w-[350.97px]" data-name="Welcome">
      <div className="flex flex-col font-['Rubik:Bold',sans-serif] font-bold justify-end relative shrink-0 size-[21.37px]">
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
        <g id="Vector_3" opacity="0"></g>
      </g>
    </svg>
  );
}

function BoldNotification() {
  return (
    <div className="absolute contents inset-0" data-name="bold/notification">
      <Notification />
    </div>
  );
}

function NumberNotification() {
  return (
    <div className="absolute bg-[#eb5757] left-[19.73px] rounded-[55.051px] size-[4.932px] top-[4.93px]" data-name="Number_notification">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="size-[4.932px]" />
      </div>
    </div>
  );
}

function Notification1() {
  return (
    <div className="absolute contents left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Notification">
      <div className="absolute left-1/2 overflow-clip size-[19.727px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="bold/notification">
        <BoldNotification />
      </div>
      <NumberNotification />
    </div>
  );
}

function Notification2() {
  return (
    <div className="overflow-clip relative shrink-0 size-[29.59px]" data-name="Notification">
      <Notification1 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute contents left-[calc(8.333%+143.84px)] top-[42.74px]" data-name="Header">
      <div className="absolute bg-white h-[55.892px] left-[calc(8.333%+143.84px)] top-[42.74px] w-[1302.78px]" data-name="Header">
        <div aria-hidden="true" className="absolute border-[0px_0px_0.822px] border-[rgba(206,216,229,0.97)] border-solid bottom-[-0.82px] left-0 pointer-events-none right-0 top-0" />
      </div>
      <div className="absolute content-stretch flex gap-[24.658px] items-center justify-end left-[calc(91.667%-17.622px)] top-[55.89px]" data-name="HeaderActions">
        <Notification2 />
        <div className="relative shrink-0 size-[29.59px]">
          <img alt="" className="block max-w-none size-full" height="29.59" src={img} width="29.59" />
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="content-stretch flex flex-col h-[51px] items-center leading-[normal] not-italic relative shrink-0 text-center w-[83px]" data-name="Features">
      <p className="font-['Poppins:SemiBold',sans-serif] h-[21px] relative shrink-0 text-[#495d72] text-[14px] w-[131px]">Used Features</p>
      <p className="font-['Poppins:Bold',sans-serif] h-[23px] relative shrink-0 text-[#4c85e9] text-[20px] w-full">8</p>
    </div>
  );
}

function Class1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center leading-[normal] not-italic relative shrink-0 text-center w-[83px]" data-name="Class#1">
      <p className="font-['Poppins:SemiBold',sans-serif] h-[21px] relative shrink-0 text-[#495d72] text-[14px] w-full">Class #1</p>
      <p className="font-['Poppins:Bold',sans-serif] relative shrink-0 text-[#4c85e9] text-[20px] w-[217px]">Stress (4)</p>
    </div>
  );
}

function Class2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center leading-[normal] not-italic relative shrink-0 text-center w-[83px]" data-name="Class#2">
      <div className="font-['Poppins:SemiBold',sans-serif] h-[21px] relative shrink-0 text-[#495d72] text-[14px] w-full">
        <p className="mb-0">Class #2</p>
        <p>&nbsp;</p>
      </div>
      <p className="font-['Poppins:Bold',sans-serif] relative shrink-0 text-[#4c85e9] text-[20px] w-[217px]">Depression (5)</p>
    </div>
  );
}

function Class3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center leading-[normal] not-italic relative shrink-0 text-center w-[83px]" data-name="Class#3">
      <p className="font-['Poppins:SemiBold',sans-serif] h-[21px] relative shrink-0 text-[#495d72] text-[14px] w-full">Class #3</p>
      <p className="font-['Poppins:Bold',sans-serif] relative shrink-0 text-[#4c85e9] text-[20px] w-[217px]">Anxiety (4)</p>
    </div>
  );
}

function Frame85() {
  return (
    <div className="absolute content-stretch flex gap-[94px] items-center justify-center left-[20px] top-[66px] w-[656px]">
      <Features />
      <Class1 />
      <Class2 />
      <Class3 />
    </div>
  );
}

function LearnMore() {
  return (
    <div className="absolute bg-[#cb2740] box-border content-stretch flex gap-[9.863px] inset-[69.18%_86.98%_10.24%_1.72%] items-center justify-center px-[13.151px] py-[9.863px] rounded-[3.288px]" data-name="LearnMore">
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13.151px] text-nowrap text-white">
        <p className="leading-[normal] whitespace-pre">Re-Train Model</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents leading-[0] left-[977px] not-italic text-center top-[55px]">
      <div className="absolute flex flex-col font-['Poppins:SemiBold',sans-serif] inset-[28.5%_3.22%_34.2%_85.29%] justify-center text-[#659756] text-[48px]">
        <p className="leading-[normal]">91,2%</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center left-[1044.5px] text-[#495d72] text-[11px] text-nowrap top-[133.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Current Model Accuracy</p>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[169px] top-[135px]">
      <div className="absolute h-[39px] left-[169px] rounded-[10px] top-[135px] w-[191px]">
        <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[10px]" />
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[180px] not-italic text-[13.151px] text-black text-nowrap top-[155px] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">My First Config</p>
      </div>
      <div className="absolute left-[336px] overflow-clip size-[18px] top-[147px]" data-name="Chevron down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Icon">
          <div className="absolute inset-[-27.78%_-13.89%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 7">
              <path d={svgPaths.p4b63400} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hist1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 w-[258px]" data-name="Hist1">
      <div className="aspect-[764/620] pointer-events-none relative rounded-[14px] shrink-0 w-full" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover rounded-[14px] size-full" src={imgImage1} />
        <div aria-hidden="true" className="absolute border border-[#bfbfbf] border-solid inset-0 rounded-[14px]" />
      </div>
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13.151px] text-black text-center w-full">
        <p className="leading-[normal]">Stress confusion matrix</p>
      </div>
    </div>
  );
}

function Hist2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 w-[258px]" data-name="Hist1">
      <div className="aspect-[764/620] pointer-events-none relative rounded-[14px] shrink-0 w-full" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover rounded-[14px] size-full" src={imgImage1} />
        <div aria-hidden="true" className="absolute border border-[#bfbfbf] border-solid inset-0 rounded-[14px]" />
      </div>
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13.151px] text-black text-center w-full">
        <p className="leading-[normal]">Depression confusion matrix</p>
      </div>
    </div>
  );
}

function Hist3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 w-[258px]" data-name="Hist1">
      <div className="aspect-[764/620] pointer-events-none relative rounded-[14px] shrink-0 w-full" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover rounded-[14px] size-full" src={imgImage1} />
        <div aria-hidden="true" className="absolute border border-[#bfbfbf] border-solid inset-0 rounded-[14px]" />
      </div>
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13.151px] text-black text-center w-full">
        <p className="leading-[normal]">Anxiety confusion matrix</p>
      </div>
    </div>
  );
}

function Heatmaps() {
  return (
    <div className="absolute content-stretch flex items-start justify-between left-[12px] top-[218px] w-[1075px]" data-name="Heatmaps">
      <Hist1 />
      <Hist2 />
      <Hist3 />
    </div>
  );
}

function WelcomeHelp() {
  return (
    <div className="absolute h-[193px] left-[calc(16.667%+83.978px)] top-[178px] w-[1149px]" data-name="WelcomeHelp">
      <div className="absolute bg-[#f4f6f7] bottom-[-417.62%] left-0 right-0 rounded-[3.288px] top-0" data-name="WelcomeSubText">
        <div aria-hidden="true" className="absolute border-[#f4f6f7] border-[0.822px] border-solid inset-[-0.822px] pointer-events-none rounded-[4.10994px]" />
      </div>
      <div className="absolute flex flex-col font-['Poppins:SemiBold',sans-serif] inset-[9.98%_36.91%_74.47%_1.72%] justify-center leading-[0] not-italic text-[#0c1e33] text-[19.727px]">
        <p className="leading-[normal]">Model Overview</p>
      </div>
      <Frame85 />
      <LearnMore />
      <Group1 />
      <div className="absolute bottom-0 left-[1.22%] right-[2%] top-full">
        <div className="absolute inset-[-0.41px_-0.04%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1113 1">
            <path d="M0.410972 0.410972H1112.41" id="Line 21" stroke="var(--stroke-0, #C9C9C9)" strokeLinecap="round" strokeWidth="0.821944" />
          </svg>
        </div>
      </div>
      <Group2 />
      <div className="absolute left-[372px] overflow-clip size-[24px] top-[143px]" data-name="Edit">
        <div className="absolute inset-[7.83%_7.83%_8.33%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-7.455%]" style={{ "--stroke-0": "rgba(0, 136, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d={svgPaths.pd40ed00} id="Icon" stroke="var(--stroke-0, #0088FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </svg>
          </div>
        </div>
      </div>
      <Heatmaps />
    </div>
  );
}

function Setting2() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="setting-2">
        <path d={svgPaths.p37842780} fill="var(--fill-0, white)" id="Vector" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldSetting2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/setting-2">
      <Setting2 />
    </div>
  );
}

function ModelSettings() {
  return (
    <div className="absolute bg-gradient-to-r box-border content-stretch flex from-[8.571%] from-[rgba(255,255,255,0.1)] gap-[9.863px] items-center left-[49.32px] px-[13.151px] py-[9.863px] rounded-bl-[4.932px] rounded-tl-[4.932px] to-[rgba(255,255,255,0)] top-[166px] w-[201.376px]" data-name="ModelSettings">
      <div aria-hidden="true" className="absolute border-[0px_0px_0px_4.932px] border-solid border-white inset-0 pointer-events-none rounded-bl-[4.932px] rounded-tl-[4.932px]" />
      <div className="relative shrink-0 size-[19.727px]" data-name="vuesax/bold/setting-2">
        <VuesaxBoldSetting2 />
      </div>
      <div className="basis-0 capitalize flex flex-col font-['Poppins:SemiBold',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[11.507px] text-white">
        <p className="leading-[normal]">Model Settings</p>
      </div>
    </div>
  );
}

function VuesaxBoldBook() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
      <g id="vuesax/bold/book">
        <path d={svgPaths.p2d060600} fill="var(--fill-0, white)" id="Vector" />
        <path d={svgPaths.p147ecfb0} fill="var(--fill-0, white)" id="Vector_2" />
        <path d={svgPaths.p3f413580} fill="var(--fill-0, white)" id="Vector_3" opacity="0" />
      </g>
    </svg>
  );
}

function Logo() {
  return (
    <div className="absolute box-border content-stretch flex gap-[4.932px] inset-[5%_8.96%_92.35%_17.91%] items-center p-[4.932px] rounded-[9.863px]" data-name="Logo">
      <div className="relative shrink-0 size-[17.261px]" data-name="vuesax/bold/book">
        <VuesaxBoldBook />
      </div>
      <div className="capitalize flex flex-col font-['Alumni_Sans_Inline_One:Regular',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-white w-[118px]">
        <p className="leading-[normal]">Scientist Space</p>
      </div>
    </div>
  );
}

function Element4() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="element-4">
        <path d={svgPaths.p16a2c600} fill="var(--fill-0, white)" id="Vector" />
        <path d={svgPaths.p2e95ef80} fill="var(--fill-0, white)" id="Vector_2" />
        <g id="Vector_3" opacity="0"></g>
        <path d={svgPaths.p2d8edc00} fill="var(--fill-0, white)" id="Vector_4" />
        <path d={svgPaths.p15dc2100} fill="var(--fill-0, white)" id="Vector_5" />
      </g>
    </svg>
  );
}

function VuesaxBoldElement4() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/element-4">
      <Element4 />
    </div>
  );
}

function Dashboard() {
  return (
    <div className="absolute box-border content-stretch flex gap-[9.863px] h-[39.453px] items-center left-[47px] overflow-clip px-[13.151px] py-[9.863px] rounded-[4.932px] top-[123px] w-[201.376px]" data-name="Dashboard">
      <div className="relative shrink-0 size-[19.727px]" data-name="vuesax/bold/element-4">
        <VuesaxBoldElement4 />
      </div>
      <div className="basis-0 capitalize flex flex-col font-['Poppins:SemiBold',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[11.507px] text-white">
        <p className="leading-[normal]">Dashboard</p>
      </div>
    </div>
  );
}

function Logout() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="logout">
        <path d={svgPaths.p37611800} fill="var(--fill-0, white)" id="Vector" />
        <path d={svgPaths.p16bb28f0} fill="var(--fill-0, white)" id="Vector_2" />
        <g id="Vector_3" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldLogout() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/logout">
      <Logout />
    </div>
  );
}

function Logout1() {
  return (
    <div className="absolute box-border content-stretch flex gap-[9.863px] h-[39.453px] items-center left-[47px] overflow-clip px-[13.151px] py-[9.863px] top-[234.05px] w-[201.376px]" data-name="Logout">
      <div className="relative shrink-0 size-[19.727px]" data-name="vuesax/bold/logout">
        <VuesaxBoldLogout />
      </div>
      <div className="basis-0 capitalize flex flex-col font-['Poppins:Medium',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[11.507px] text-white">
        <p className="leading-[normal]">logout</p>
      </div>
    </div>
  );
}

function Help() {
  return (
    <div className="absolute box-border content-stretch flex gap-[9.863px] h-[39.453px] items-center left-[47px] overflow-clip px-[13.151px] py-[9.863px] top-[272.05px] w-[201.376px]" data-name="Help">
      <div className="h-[20px] overflow-clip relative shrink-0 w-[19px]" data-name="Info">
        <div className="absolute inset-[8.333%]" data-name="Icon">
          <div className="absolute inset-[-12%_-12.63%]" style={{ "--stroke-0": "rgba(217, 217, 217, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 21">
              <path d={svgPaths.p1d4468f0} id="Icon" stroke="var(--stroke-0, #D9D9D9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
            </svg>
          </div>
        </div>
      </div>
      <div className="basis-0 capitalize flex flex-col font-['Poppins:Medium',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[11.507px] text-white">
        <p className="leading-[normal]">help</p>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="absolute h-[1117.84px] left-0 top-0 w-[275.351px]" data-name="Sidebar">
      <div className="absolute bg-[#0c1e33] inset-0" data-name="SidebarBackground" />
      <div className="absolute bottom-[80.58%] left-0 right-0 top-[19.42%]">
        <div className="absolute inset-[-0.41px_-0.15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 277 1">
            <path d="M0.410972 0.410972H275.762" id="Line 21" opacity="0.48" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="0.821944" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[91.18%] left-0 right-0 top-[8.82%]">
        <div className="absolute inset-[-0.41px_-0.15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 277 1">
            <path d="M0.410972 0.410972H275.762" id="Line 21" opacity="0.48" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="0.821944" />
          </svg>
        </div>
      </div>
      <ModelSettings />
      <Logo />
      <Dashboard />
      <Logout1 />
      <Help />
    </div>
  );
}

function IconShare() {
  return (
    <div className="absolute left-0 size-[19.727px] top-0" data-name="Icon • Share">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon â¢ Share">
          <path d={svgPaths.p29edb780} fill="var(--fill-0, #717171)" id="Share" />
        </g>
      </svg>
    </div>
  );
}

function IconNewTab() {
  return (
    <div className="absolute left-[28.77px] size-[19.727px] top-0" data-name="Icon • New Tab">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon â¢ New Tab">
          <path d={svgPaths.p25e24d00} fill="var(--fill-0, #717171)" id="New Tab" />
        </g>
      </svg>
    </div>
  );
}

function IconTabOverview() {
  return (
    <div className="absolute left-[59.18px] size-[19.727px] top-0" data-name="Icon • Tab Overview">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon â¢ Tab Overview">
          <path d={svgPaths.p3eb6de00} fill="var(--fill-0, #717171)" id="Tab Overview" />
        </g>
      </svg>
    </div>
  );
}

function RightIconSet() {
  return (
    <div className="absolute h-[19.727px] overflow-clip right-[13.28px] top-[10.69px] w-[78.907px]" data-name="Right Icon Set">
      <IconShare />
      <IconNewTab />
      <IconTabOverview />
    </div>
  );
}

function IconSidebar() {
  return (
    <div className="absolute left-0 size-[19.727px] top-0" data-name="Icon • Sidebar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon â¢ Sidebar">
          <path d={svgPaths.pf68a380} fill="var(--fill-0, #717171)" id="Sidebar" />
        </g>
      </svg>
    </div>
  );
}

function IconChevronLeft() {
  return (
    <div className="absolute left-[32.88px] size-[19.727px] top-0" data-name="Icon • Chevron Left">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon â¢ Chevron Left">
          <path d={svgPaths.pa832500} fill="var(--fill-0, #717171)" id="Chevron Left" />
        </g>
      </svg>
    </div>
  );
}

function IconChevronRight() {
  return (
    <div className="absolute left-[60.82px] size-[19.727px] top-0" data-name="Icon • Chevron Right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon â¢ Chevron Right">
          <path d={svgPaths.p1728ab00} fill="var(--fill-0, #BDBCBC)" id="Chevron Right" />
        </g>
      </svg>
    </div>
  );
}

function LeftIconSet() {
  return (
    <div className="absolute h-[19.727px] left-[78.91px] overflow-clip top-[10.69px] w-[80.55px]" data-name="Left Icon Set">
      <IconSidebar />
      <IconChevronLeft />
      <IconChevronRight />
    </div>
  );
}

function WindowControls() {
  return (
    <div className="absolute h-[9.863px] left-[16.44px] top-[16.44px] w-[42.741px]" data-name="Window Controls">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 43 10">
        <g clipPath="url(#clip0_1_623)" id="Window Controls">
          <g id="Close">
            <circle cx="4.93166" cy="4.93166" fill="var(--fill-0, #ED6A5E)" r="4.93166" />
            <circle cx="4.93166" cy="4.93166" r="4.52069" stroke="var(--stroke-0, black)" strokeOpacity="0.1" strokeWidth="0.821944" />
          </g>
          <g id="Minimize">
            <circle cx="21.3705" cy="4.93166" fill="var(--fill-0, #F4BD50)" r="4.93166" />
            <circle cx="21.3705" cy="4.93166" r="4.52069" stroke="var(--stroke-0, black)" strokeOpacity="0.1" strokeWidth="0.821944" />
          </g>
          <g id="Zoom">
            <circle cx="37.8093" cy="4.93166" fill="var(--fill-0, #61C454)" r="4.93166" />
            <circle cx="37.8093" cy="4.93166" r="4.52069" stroke="var(--stroke-0, black)" strokeOpacity="0.1" strokeWidth="0.821944" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_623">
            <rect fill="white" height="9.86333" width="42.7411" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function UrlAddress() {
  return (
    <div className="absolute content-stretch flex gap-[3.288px] items-center justify-center leading-[normal] left-[calc(50%-1.155px)] not-italic text-nowrap top-[calc(50%+0.411px)] translate-x-[-50%] translate-y-[-50%] whitespace-pre" data-name="URL Address">
      <p className="font-['SF_Pro_Display:Medium',sans-serif] relative shrink-0 text-[#9c9c9c] text-[9.863px] tracking-[-0.0296px]">􀎡</p>
      <p className="font-['Poppins:Regular',sans-serif] relative shrink-0 text-[#4c4c4c] text-[11.507px] text-center">StudentHelper.com</p>
    </div>
  );
}

function IconClockwiseArrow() {
  return (
    <div className="absolute h-[11.507px] right-[4.37px] top-[4.93px] w-[10.685px]" data-name="Icon • Clockwise Arrow">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
        <g clipPath="url(#clip0_1_875)" id="Icon â¢ Clockwise Arrow">
          <path d={svgPaths.p2bbefe80} fill="var(--fill-0, #787878)" id="Clockwise Arrow" />
        </g>
        <defs>
          <clipPath id="clip0_1_875">
            <rect fill="white" height="11.5072" width="10.6853" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconShield() {
  return (
    <div className="absolute left-[-28.77px] size-[19.727px] top-[0.82px]" data-name="Icon • Shield">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon â¢ Shield">
          <path d={svgPaths.p27950280} fill="var(--fill-0, #717171)" id="Shield" />
        </g>
      </svg>
    </div>
  );
}

function UrlForm() {
  return (
    <div className="absolute h-[23.014px] left-[30.57%] right-[30.58%] top-[9.86px]" data-name="URL Form">
      <div className="absolute h-[23.014px] left-0 right-[-0.16px] top-0" data-name="URL Background">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 614 24">
          <path d={svgPaths.p31a6cd00} fill="var(--fill-0, #F0F0F0)" id="URL Background" />
        </svg>
      </div>
      <UrlAddress />
      <IconClockwiseArrow />
      <IconShield />
    </div>
  );
}

function IntegratedTitleBarAndToolbar() {
  return (
    <div className="absolute h-[42.741px] left-1/2 top-0 translate-x-[-50%] w-[1578.13px]" data-name="_Integrated title bar and toolbar">
      <div className="absolute bg-[#fdfdfd] h-[42.741px] left-0 right-[0.13px] top-0" data-name="Toolbar • Background" />
      <RightIconSet />
      <LeftIconSet />
      <WindowControls />
      <UrlForm />
    </div>
  );
}

function Modal() {
  return (
    <div className="absolute contents left-0 top-[43px]" data-name="Modal">
      <div className="absolute bg-black h-[1075px] left-0 opacity-40 top-[43px] w-[1578px]" data-name="Blur" />
    </div>
  );
}

function StateLayer() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="bg-[#6750a4] rounded-[2px] shrink-0 size-[18px]" data-name="container" />
      <div className="absolute left-1/2 overflow-clip size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="check_small">
        <div className="absolute bottom-[31.67%] left-1/4 right-1/4 top-[29.17%]" data-name="icon">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 10">
              <path d={svgPaths.p35d39780} fill="var(--fill-0, white)" id="icon" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex h-[53px] items-center left-[calc(16.667%+120.062px)] top-[393px] w-[159.481px]">
      <div className="box-border content-stretch flex flex-col items-center justify-center p-[4px] relative shrink-0" data-name="Checkboxes">
        <StateLayer />
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">Sleep quality</p>
      </div>
    </div>
  );
}

function StateLayer1() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="bg-[#6750a4] rounded-[2px] shrink-0 size-[18px]" data-name="container" />
      <div className="absolute left-1/2 overflow-clip size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="check_small">
        <div className="absolute bottom-[31.67%] left-1/4 right-1/4 top-[29.17%]" data-name="icon">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 10">
              <path d={svgPaths.p35d39780} fill="var(--fill-0, white)" id="icon" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex h-[53px] items-center left-[calc(33.333%+12.483px)] top-[393px] w-[160.49px]">
      <div className="box-border content-stretch flex flex-col items-center justify-center p-[4px] relative shrink-0" data-name="Checkboxes">
        <StateLayer1 />
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">Sleep quality</p>
      </div>
    </div>
  );
}

function StateLayer2() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="bg-[#6750a4] rounded-[2px] shrink-0 size-[18px]" data-name="container" />
      <div className="absolute left-1/2 overflow-clip size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="check_small">
        <div className="absolute bottom-[31.67%] left-1/4 right-1/4 top-[29.17%]" data-name="icon">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 10">
              <path d={svgPaths.p35d39780} fill="var(--fill-0, white)" id="icon" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch flex h-[53px] items-center left-[calc(41.667%+65.688px)] top-[393px] w-[159.481px]">
      <div className="box-border content-stretch flex flex-col items-center justify-center p-[4px] relative shrink-0" data-name="Checkboxes">
        <StateLayer2 />
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">Sleep quality</p>
      </div>
    </div>
  );
}

function StateLayer3() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="bg-[#6750a4] rounded-[2px] shrink-0 size-[18px]" data-name="container" />
      <div className="absolute left-1/2 overflow-clip size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="check_small">
        <div className="absolute bottom-[31.67%] left-1/4 right-1/4 top-[29.17%]" data-name="icon">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 10">
              <path d={svgPaths.p35d39780} fill="var(--fill-0, white)" id="icon" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute content-stretch flex h-[53px] items-center left-[calc(50%+99.714px)] top-[393px] w-[159.481px]">
      <div className="box-border content-stretch flex flex-col items-center justify-center p-[4px] relative shrink-0" data-name="Checkboxes">
        <StateLayer3 />
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">Sleep quality</p>
      </div>
    </div>
  );
}

function StateLayer4() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="bg-[#6750a4] rounded-[2px] shrink-0 size-[18px]" data-name="container" />
      <div className="absolute left-1/2 overflow-clip size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="check_small">
        <div className="absolute bottom-[31.67%] left-1/4 right-1/4 top-[29.17%]" data-name="icon">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 10">
              <path d={svgPaths.p35d39780} fill="var(--fill-0, white)" id="icon" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex h-[53px] items-center left-[calc(66.667%+20.397px)] top-[393px] w-[160.49px]">
      <div className="box-border content-stretch flex flex-col items-center justify-center p-[4px] relative shrink-0" data-name="Checkboxes">
        <StateLayer4 />
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">Sleep quality</p>
      </div>
    </div>
  );
}

function StateLayer5() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="bg-[#6750a4] rounded-[2px] shrink-0 size-[18px]" data-name="container" />
      <div className="absolute left-1/2 overflow-clip size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="check_small">
        <div className="absolute bottom-[31.67%] left-1/4 right-1/4 top-[29.17%]" data-name="icon">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 10">
              <path d={svgPaths.p35d39780} fill="var(--fill-0, white)" id="icon" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute content-stretch flex h-[53px] items-center left-[calc(75%+83.695px)] top-[393px] w-[159.481px]">
      <div className="box-border content-stretch flex flex-col items-center justify-center p-[4px] relative shrink-0" data-name="Checkboxes">
        <StateLayer5 />
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">Sleep quality</p>
      </div>
    </div>
  );
}

function StateLayer6() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="bg-[#6750a4] rounded-[2px] shrink-0 size-[18px]" data-name="container" />
      <div className="absolute left-1/2 overflow-clip size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="check_small">
        <div className="absolute bottom-[31.67%] left-1/4 right-1/4 top-[29.17%]" data-name="icon">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 10">
              <path d={svgPaths.p35d39780} fill="var(--fill-0, white)" id="icon" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex h-[53px] items-center left-[calc(16.667%+120.062px)] top-[446px] w-[159.481px]">
      <div className="box-border content-stretch flex flex-col items-center justify-center p-[4px] relative shrink-0" data-name="Checkboxes">
        <StateLayer6 />
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">Sleep quality</p>
      </div>
    </div>
  );
}

function StateLayer7() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="relative rounded-[2px] shrink-0 size-[18px]" data-name="container">
        <div aria-hidden="true" className="absolute border-2 border-[#49454f] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute content-stretch flex h-[53px] items-center left-[calc(33.333%+25.605px)] top-[446px] w-[160.49px]">
      <div className="box-border content-stretch flex flex-col items-center justify-center p-[4px] relative shrink-0" data-name="Checkboxes">
        <StateLayer7 />
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">Sleep quality</p>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[calc(16.667%+110.978px)] top-[346px]">
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(16.667%+225.037px)] not-italic text-[20px] text-black text-center top-[378px] translate-x-[-50%] translate-y-[-50%] w-[185.724px]">
        <p className="leading-[normal]">Features selection</p>
      </div>
      <Frame3 />
      <Frame4 />
      <Frame5 />
      <Frame6 />
      <Frame7 />
      <Frame8 />
      <Frame9 />
      <Frame10 />
      <div className="absolute h-[165px] left-[calc(16.667%+110.978px)] rounded-[14px] top-[346px] w-[1077px]">
        <div aria-hidden="true" className="absolute border border-[#9e9e9e] border-solid inset-0 pointer-events-none rounded-[14px]" />
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[calc(16.667%+110.978px)] top-[541px]">
      <div className="absolute flex flex-col font-['Poppins:Bold',sans-serif] h-[33.164px] justify-center leading-[0] left-[calc(33.333%+36.956px)] not-italic text-[32px] text-black top-[572.11px] translate-y-[-50%] w-[185.724px]">
        <p className="leading-[normal]">
          <span className="text-[#64cda3]">80</span>
          <span className="text-[#cccccc]">:</span>
          <span className="text-[#ed759b]">20</span>
        </p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] h-[20.727px] justify-center leading-[0] left-[calc(16.667%+132.175px)] not-italic text-[20px] text-black top-[572.11px] translate-y-[-50%] w-[185.724px]">
        <p className="leading-[normal]">Train:Test ratio:</p>
      </div>
      <div className="absolute h-[114px] left-[calc(16.667%+110.978px)] rounded-[14px] top-[541px] w-[1077px]">
        <div aria-hidden="true" className="absolute border border-[#9e9e9e] border-solid inset-0 pointer-events-none rounded-[14px]" />
      </div>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[calc(16.667%+131.978px)] top-[742px]">
      <div className="absolute h-[38px] left-[calc(16.667%+131.978px)] top-[742px] w-[244px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 244 38">
          <path d={svgPaths.p2a3c5200} id="Rectangle 21" stroke="var(--stroke-0, #AAAAAA)" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(33.333%+100.956px)] not-italic text-[16px] text-black text-nowrap text-right top-[761px] translate-x-[-100%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">100</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(25%+12.467px)] not-italic text-[16px] text-black text-nowrap top-[761px] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">N Estimators:</p>
      </div>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents left-[calc(16.667%+131.978px)] top-[792px]">
      <div className="absolute h-[38px] left-[calc(16.667%+131.978px)] top-[792px] w-[244px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 244 38">
          <path d={svgPaths.p2a3c5200} id="Rectangle 21" stroke="var(--stroke-0, #AAAAAA)" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(33.333%+100.956px)] not-italic text-[16px] text-black text-nowrap text-right top-[811px] translate-x-[-100%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">sqrt</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(25%+12.467px)] not-italic text-[16px] text-black text-nowrap top-[811px] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Max features:</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Light',sans-serif] justify-center leading-[0] left-[calc(25%+12.467px)] not-italic text-[#a6a6a6] text-[12px] text-nowrap top-[843px] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Learn more on sklearn document</p>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-[calc(58.333%+4.423px)] top-[742px]">
      <div className="absolute h-[38px] left-[calc(58.333%+4.423px)] top-[742px] w-[244px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 244 38">
          <path d={svgPaths.p2a3c5200} id="Rectangle 21" stroke="var(--stroke-0, #AAAAAA)" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(66.667%+104.912px)] not-italic text-[16px] text-black text-nowrap text-right top-[761px] translate-x-[-100%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">100</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(58.333%+16.423px)] not-italic text-[16px] text-black text-nowrap top-[761px] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Max depth:</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Light',sans-serif] justify-center leading-[0] left-[calc(58.333%+16.423px)] not-italic text-[#a6a6a6] text-[12px] text-nowrap top-[792px] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Leave empty for None</p>
      </div>
    </div>
  );
}

function HandleShape() {
  return (
    <div className="bg-white box-border content-stretch flex items-center justify-center overflow-clip p-[11px] relative rounded-[24px] shrink-0" data-name="Handle shape">
      <div className="rounded-[23px] shrink-0 size-[2px]" data-name="Container" />
    </div>
  );
}

function StateLayer8() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[8px] items-center justify-center p-[8px] relative rounded-[100px] shrink-0" data-name="State-layer">
      <HandleShape />
    </div>
  );
}

function Target() {
  return (
    <div className="absolute box-border content-stretch flex items-center justify-center p-[4px] right-[-12px] top-1/2 translate-y-[-50%]" data-name="Target">
      <StateLayer8 />
    </div>
  );
}

function Handle() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Handle">
      <Target />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents left-[calc(75%+6.401px)] top-[742px]">
      <div className="absolute bg-[#6750a4] box-border content-stretch flex h-[32px] items-center justify-end left-[calc(83.333%+60.89px)] px-[4px] py-[2px] rounded-[100px] top-[745px] w-[52px]" data-name="Switch">
        <Handle />
      </div>
      <div className="absolute h-[38px] left-[calc(75%+6.401px)] top-[742px] w-[244px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 244 38">
          <path d={svgPaths.p2a3c5200} id="Rectangle 21" stroke="var(--stroke-0, #AAAAAA)" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(75%+18.401px)] not-italic text-[16px] text-black text-nowrap top-[761px] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Bootstrap</p>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents left-[calc(41.667%+2.445px)] top-[742px]">
      <div className="absolute h-[38px] left-[calc(41.667%+2.445px)] top-[742px] w-[244px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 244 38">
          <path d={svgPaths.p2a3c5200} id="Rectangle 21" stroke="var(--stroke-0, #AAAAAA)" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(50%+89.934px)] not-italic text-[16px] text-black text-nowrap text-right top-[761px] translate-x-[-100%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Gini</p>
      </div>
      <div className="absolute left-[calc(50%+93.934px)] overflow-clip size-[18px] top-[754px]" data-name="Chevron down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Icon">
          <div className="absolute inset-[-27.78%_-13.89%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 7">
              <path d={svgPaths.p4b63400} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(41.667%+14.445px)] not-italic text-[16px] text-black text-nowrap top-[761px] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Criterion:</p>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-[calc(16.667%+110.978px)] top-[685px]">
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(16.667%+132.175px)] not-italic text-[20px] text-black top-[717px] translate-y-[-50%] w-[185.724px]">
        <p className="leading-[normal]">Parameters</p>
      </div>
      <Group7 />
      <Group11 />
      <Group9 />
      <Group10 />
      <Group8 />
      <div className="absolute h-[197px] left-[calc(16.667%+110.978px)] rounded-[14px] top-[685px] w-[1077px]">
        <div aria-hidden="true" className="absolute border border-[#9e9e9e] border-solid inset-0 pointer-events-none rounded-[14px]" />
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[calc(16.667%+110.978px)] top-[260px]">
      <div className="absolute h-[56px] left-[calc(16.667%+110.978px)] rounded-[14px] top-[260px] w-[312px]">
        <div aria-hidden="true" className="absolute border border-[#969696] border-solid inset-0 pointer-events-none rounded-[14px]" />
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(16.667%+199.978px)] not-italic text-[20px] text-black text-center text-nowrap top-[288px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">My First Config</p>
      </div>
    </div>
  );
}

function Frame87() {
  return (
    <div className="absolute bg-[#dd4444] box-border content-stretch flex gap-[10px] h-[56px] items-center justify-center left-[calc(75%+41.401px)] px-[14px] py-[6px] rounded-[14px] top-[260px] w-[107px]">
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-nowrap text-white">
        <p className="leading-[normal] whitespace-pre">Delete</p>
      </div>
    </div>
  );
}

function Frame88() {
  return (
    <div className="absolute bg-[#44dd9e] box-border content-stretch flex gap-[10px] h-[56px] items-center justify-center left-[calc(83.333%+28.89px)] px-[14px] py-[6px] rounded-[14px] top-[260px] w-[107px]">
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-nowrap text-white">
        <p className="leading-[normal] whitespace-pre">Save</p>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="absolute contents left-[calc(16.667%+81.978px)] top-[178px]" data-name="Form">
      <div className="absolute bg-white h-[803px] left-[calc(16.667%+81.978px)] top-[178px] w-[1145px]" />
      <div className="absolute flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] left-[calc(16.667%+208.478px)] not-italic text-[24px] text-black text-center text-nowrap top-[220px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Edit configuration</p>
      </div>
      <Group3 />
      <Group5 />
      <Group6 />
      <Group4 />
      <Frame87 />
      <Frame88 />
      <div className="absolute left-[calc(91.667%+4.378px)] overflow-clip size-[24px] top-[204px]" data-name="close">
        <div className="absolute inset-[20.833%]" data-name="icon">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(29, 27, 32, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
              <path d={svgPaths.p2aa77200} fill="var(--fill-0, #1D1B20)" id="icon" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[6px] h-[67px] items-center left-[calc(16.667%+131.978px)] top-[588px] w-[1028px]" data-name="Standard slider">
        <div className="basis-0 content-stretch flex flex-col grow h-[16px] items-center justify-center min-h-px min-w-px overflow-clip relative shrink-0" data-name="Active track">
          <div className="basis-0 bg-[#6750a4] grow min-h-px min-w-px rounded-bl-[16px] rounded-br-[2px] rounded-tl-[16px] rounded-tr-[2px] shrink-0 w-full" data-name="Track" />
        </div>
        <div className="bg-[#6750a4] h-[44px] overflow-clip rounded-[2px] shrink-0 w-[4px]" data-name="Handle" />
        <div className="basis-0 content-stretch flex grow h-[16px] items-center justify-between min-h-px min-w-px overflow-clip relative shrink-0" data-name="Inactive track">
          <div className="basis-0 bg-[#e8def8] grow h-full min-h-px min-w-px rounded-bl-[2px] rounded-br-[16px] rounded-tl-[2px] rounded-tr-[16px] shrink-0" data-name="Track" />
          <div className="absolute right-[4px] size-[4px] top-1/2 translate-y-[-50%]" data-name=".Building Blocks/Track stop">
            <div className="absolute inset-0" style={{ "--fill-0": "rgba(74, 68, 89, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
                <circle cx="2" cy="2" fill="var(--fill-0, #4A4459)" id="Dot" r="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModelSettings2() {
  return (
    <div className="bg-white overflow-clip relative rounded-[30px] shadow-[0px_5.94px_23.761px_0px_rgba(12,30,51,0.12)] size-full" data-name="ModelSettings 2">
      <Welcome />
      <Header />
      <WelcomeHelp />
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(91.667%+8.878px)] not-italic text-[#495d72] text-[8.219px] text-center text-nowrap top-[146.55px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">1 Nov 2025, Monday</p>
      </div>
      <Sidebar />
      <IntegratedTitleBarAndToolbar />
      <div className="absolute h-[462px] left-[calc(25%+94.467px)] top-[656px] w-[816px]" data-name="image 2">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage2} />
      </div>
      <Modal />
      <Form />
    </div>
  );
}