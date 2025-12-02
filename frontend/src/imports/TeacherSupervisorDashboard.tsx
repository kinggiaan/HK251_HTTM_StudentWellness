import svgPaths from "./svg-ws6xw1un37";
import img from "figma:asset/b84a227f158a096d5fb31a5a5f2dd6c595e78767.png";
import { imgGroup } from "./svg-9rgfw";

function Welcome() {
  return (
    <div className="absolute box-border content-stretch flex gap-[9.863px] items-center leading-[0] left-[calc(16.667%+77.978px)] px-[4.11px] py-0 text-[#0c1e33] text-[19.727px] top-[123.29px] w-[350.97px]" data-name="Welcome">
      <div className="flex flex-col font-['Rubik:Bold',sans-serif] font-bold justify-end relative shrink-0 size-[21.37px]">
        <p className="leading-[normal]">👋</p>
      </div>
      <div className="basis-0 capitalize flex flex-col font-['Poppins:Regular',sans-serif] grow justify-center min-h-px min-w-px not-italic relative shrink-0">
        <p className="leading-[normal]">Welcome, Mr. Nguyen!</p>
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

function ArrowRight() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="arrow-right">
        <path d={svgPaths.p1335b080} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.64389" />
        <path d="M2.8768 9.86333H16.7101" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.64389" />
        <g id="Vector_3" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxLinearArrowRight() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/arrow-right">
      <ArrowRight />
    </div>
  );
}

function LearnMore() {
  return (
    <div className="absolute bg-[#0c1e33] box-border content-stretch flex gap-[9.863px] inset-[69.18%_86.98%_10.24%_1.72%] items-center justify-center px-[13.151px] py-[9.863px] rounded-[3.288px]" data-name="LearnMore">
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13.151px] text-nowrap text-white">
        <p className="leading-[normal] whitespace-pre">Learn More</p>
      </div>
      <div className="relative shrink-0 size-[19.727px]" data-name="vuesax/linear/arrow-right">
        <VuesaxLinearArrowRight />
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[96.95%_64.66%_-1.14%_23.35%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2.247px_-0.759px] mask-size-[29.242px_5.596px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 7">
        <g id="Group">
          <path d={svgPaths.p136580f0} fill="var(--fill-0, #CEBFB9)" id="Vector" />
          <path d={svgPaths.p3d487580} fill="var(--fill-0, #CEBFB9)" id="Vector_2" />
          <path d={svgPaths.p16f44e40} fill="var(--fill-0, #CEBFB9)" id="Vector_3" />
          <path d={svgPaths.p3a3300f0} fill="var(--fill-0, #CEBFB9)" id="Vector_4" />
          <path d={svgPaths.p78266e0} fill="var(--fill-0, #CEBFB9)" id="Vector_5" />
          <path d={svgPaths.p9909500} fill="var(--fill-0, #CEBFB9)" id="Vector_6" />
          <path d={svgPaths.p38720b80} fill="var(--fill-0, #CEBFB9)" id="Vector_7" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-[96.48%_63.56%_0.05%_22.26%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function IsolationMode() {
  return (
    <div className="absolute inset-[14.51%_0.49%_2.02%_81.55%] overflow-clip" data-name="Isolation_Mode">
      <div className="absolute inset-[96.48%_63.56%_0.05%_22.25%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 6">
          <path d={svgPaths.pa050e00} fill="var(--fill-0, #E0D1CA)" id="Vector" />
        </svg>
      </div>
      <ClipPathGroup />
      <div className="absolute inset-[42.68%_35.49%_36.85%_33.9%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 33">
          <path d={svgPaths.p13ac44f0} fill="var(--fill-0, #FEB446)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[43%_60.63%_48.36%_32.46%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14">
          <path d={svgPaths.p31692400} fill="var(--fill-0, #FEB446)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[20.54%_36.58%_59%_32.8%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 33">
          <path d={svgPaths.p29497a70} fill="var(--fill-0, #FEB446)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[32.04%_35.15%_59.32%_57.95%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14">
          <path d={svgPaths.pdb3f3c0} fill="var(--fill-0, #FEB446)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[73.94%_34.28%_0.05%_58.18%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 42">
          <path d={svgPaths.p35ba4400} fill="var(--fill-0, #B23636)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[72.43%_20.58%_0.05%_62.56%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 45">
          <path d={svgPaths.p245c5c00} fill="var(--fill-0, #B23636)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[68.19%_44.01%_24.45%_46.91%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 12">
          <path d={svgPaths.p60c2500} fill="var(--fill-0, #EEAB93)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[71.22%_49.57%_27.94%_49.5%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
          <path d={svgPaths.p2a1d0e80} fill="var(--fill-0, #CE807B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[69.1%_44.81%_29.41%_53.59%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 3">
          <path d={svgPaths.p89ea700} fill="var(--fill-0, #CE807B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[69.96%_44.47%_28.54%_53.76%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 3">
          <path d={svgPaths.p1748a00} fill="var(--fill-0, #CE807B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[72.88%_49.66%_10.99%_33.23%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 26">
          <path d={svgPaths.p37661800} fill="var(--fill-0, #F0E9E2)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[71.89%_63.18%_1.15%_21.62%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 44">
          <path d={svgPaths.pb036280} fill="var(--fill-0, #F0E9E2)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[74.66%_75.42%_0.05%_15.4%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 41">
          <path d={svgPaths.pc75a700} fill="var(--fill-0, #F0E9E2)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[71.88%_67.04%_24.5%_24.04%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 6">
          <path d={svgPaths.p353e6380} fill="var(--fill-0, #E19A85)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[53.46%_75.69%_39.99%_20.07%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 11">
          <path d={svgPaths.p1bdee230} fill="var(--fill-0, #A96861)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[53.22%_67.89%_31.83%_21.61%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 25">
          <path d={svgPaths.p3e751e72} fill="var(--fill-0, #A96861)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[64.95%_69.36%_26.02%_25.48%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 15">
          <path d={svgPaths.p3785ab00} fill="var(--fill-0, #E19A85)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[64.95%_68.71%_26.71%_25.8%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 14">
          <path d={svgPaths.p3ff0dd00} fill="var(--fill-0, #CE807B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[55.88%_66.78%_29.86%_24.86%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 23">
          <path d={svgPaths.pd5a0080} fill="var(--fill-0, #F0AD95)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[54.23%_70.24%_35.32%_23.78%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 17">
          <path d={svgPaths.p9d65f00} fill="var(--fill-0, #A96861)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[59.53%_67.34%_39.4%_30.63%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 2">
          <path d={svgPaths.pe412400} fill="var(--fill-0, #A96861)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[60.74%_70.85%_37.26%_26.86%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 4">
          <path d={svgPaths.p3e5c3bc0} fill="var(--fill-0, #A96861)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[61.03%_68.01%_34.52%_30.19%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 8">
          <path d={svgPaths.p22d3f00} fill="var(--fill-0, #CF807C)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[63.51%_73.86%_33.37%_23.91%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 6">
          <path d={svgPaths.p321aa600} fill="var(--fill-0, #F0AD95)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[64.22%_74.39%_34.08%_24.46%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
          <path d={svgPaths.p3d8c3f80} fill="var(--fill-0, #CE807B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[66.04%_67.97%_32.05%_29.18%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 4">
          <path d={svgPaths.p1052eb40} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[66.62%_68.47%_32.47%_29.62%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 2">
          <path d={svgPaths.pde48d00} fill="var(--fill-0, #EEEBF2)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[61.23%_67.15%_37.55%_31.15%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 2">
          <path d={svgPaths.p26e45200} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[62.56%_70.76%_36.11%_27.37%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 3">
          <path d={svgPaths.pb045180} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[55.14%_70.97%_37.22%_25.17%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 13">
          <path d={svgPaths.p2d5fe900} fill="var(--fill-0, #94504B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[60.04%_74.86%_36.91%_24.41%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 5">
          <path d={svgPaths.pfa2be00} fill="var(--fill-0, #94504B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[54.24%_74.54%_38.39%_21.99%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 12">
          <path d={svgPaths.p5a39900} fill="var(--fill-0, #94504B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[64.37%_74.68%_32.81%_22.94%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
          <path d={svgPaths.p1e473500} fill="var(--fill-0, #94504B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[54.16%_72.6%_43.67%_24.5%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 4">
          <path d={svgPaths.p18070700} fill="var(--fill-0, #94504B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[55.29%_78.34%_40.8%_20.53%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 7">
          <path d={svgPaths.p2163a280} fill="var(--fill-0, #94504B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[54.98%_77.57%_43.65%_21.34%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
          <path d={svgPaths.p32122300} fill="var(--fill-0, #94504B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[53.71%_76.03%_45.51%_22.57%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 2">
          <path d={svgPaths.p1e707800} fill="var(--fill-0, #94504B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[55.13%_68.15%_42.56%_29.75%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 4">
          <path d={svgPaths.p2b5bfd80} fill="var(--fill-0, #94504B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[54.09%_69.91%_45.31%_28.78%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 1">
          <path d={svgPaths.p19157200} fill="var(--fill-0, #94504B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[58.02%_76.55%_36.95%_22.7%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 9">
          <path d={svgPaths.pe878a00} fill="var(--fill-0, #94504B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[83.5%_28.75%_9.65%_63.58%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 12">
          <path d={svgPaths.p11768d00} fill="var(--fill-0, #EEAB93)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[64.9%_26.24%_27.3%_68.12%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 13">
          <path d={svgPaths.p9b31280} fill="var(--fill-0, #CC807B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[71.29%_24.35%_25.06%_66.01%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 6">
          <path d={svgPaths.pcd4a180} fill="var(--fill-0, #DED3C7)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[69.17%_25.73%_25.86%_69.92%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 8">
          <path d={svgPaths.p27e496f0} fill="var(--fill-0, #F4EEE9)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[69.92%_30.08%_26.03%_67.05%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 7">
          <path d={svgPaths.p18f61800} fill="var(--fill-0, #F4EEE9)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[74.28%_15.44%_1.01%_69.97%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 40">
          <path d={svgPaths.p222b8b00} fill="var(--fill-0, #B23636)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[16.86%_30.32%_66.37%_53.55%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 28">
          <path d={svgPaths.p2a079880} fill="var(--fill-0, #DB9281)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[29.54%_59.15%_58.42%_26.49%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 20">
          <path d={svgPaths.p12c49530} fill="var(--fill-0, #F4EEE9)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[38.48%_71.09%_56.38%_25.96%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 9">
          <path d={svgPaths.p3b0a0a40} fill="var(--fill-0, #F4EEE9)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[19.45%_32.6%_79.98%_55.87%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 1">
          <path d={svgPaths.p3539480} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[21.7%_32.59%_77.74%_60.36%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 1">
          <path d={svgPaths.p2a252100} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[21.7%_41.08%_77.74%_55.86%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 1">
          <path d={svgPaths.p22016470} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[23.94%_32.59%_75.49%_65.08%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 1">
          <path d={svgPaths.p32fe600} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[23.94%_36.73%_75.49%_55.86%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 1">
          <path d={svgPaths.p287f5700} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[26.19%_35.59%_73.24%_55.86%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 1">
          <path d={svgPaths.p1d995400} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[34.31%_68.68%_63.19%_29.37%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
          <path d={svgPaths.p2038d700} fill="var(--fill-0, #88A1BF)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[34.31%_65.35%_63.19%_32.7%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
          <path d={svgPaths.p68f9b80} fill="var(--fill-0, #88A1BF)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[34.31%_62.03%_63.19%_36.02%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
          <path d={svgPaths.p2f867700} fill="var(--fill-0, #88A1BF)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[79.06%_63.05%_0.96%_22.08%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 33">
          <path d={svgPaths.pb68c500} fill="var(--fill-0, #CEBFB9)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[79.45%_62.9%_18.22%_36.64%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 4">
          <path d={svgPaths.p344a8300} fill="var(--fill-0, #CEBFB9)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[75.48%_49.52%_10.82%_36.4%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 23">
          <path d={svgPaths.p219e8400} fill="var(--fill-0, #CEBFB9)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[81.89%_74.27%_-0.12%_20.43%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 30">
          <path d={svgPaths.p37fa1300} fill="var(--fill-0, #CEBFB9)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[82.75%_74%_15.95%_24.75%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
          <path d={svgPaths.pda10000} fill="var(--fill-0, #CEBFB9)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[84.51%_65.75%_13.17%_32.16%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 4">
          <path d={svgPaths.p2a77ddc0} fill="var(--fill-0, #CEBFB9)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[85.88%_65.92%_13.06%_33.04%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 2">
          <path d={svgPaths.p3e397600} fill="var(--fill-0, #CEBFB9)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[87.53%_57.45%_11.71%_40.86%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 2">
          <path d={svgPaths.p21bf3300} fill="var(--fill-0, #CEBFB9)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[92%_82.71%_5.5%_16.59%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 5">
          <path d={svgPaths.p107f8980} fill="var(--fill-0, #CEBFB9)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[81.88%_21.51%_1.75%_69.84%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 27">
          <path d={svgPaths.p7eced80} fill="var(--fill-0, #932525)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[82.56%_23.42%_15.14%_74.94%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <path d={svgPaths.p2bb2b200} fill="var(--fill-0, #932525)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[88.08%_18.15%_8.56%_77.35%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 6">
          <path d={svgPaths.p371c5180} fill="var(--fill-0, #932525)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[89.12%_18.39%_9.93%_79.51%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 2">
          <path d={svgPaths.pb0a580} fill="var(--fill-0, #932525)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[80.88%_36.94%_0.11%_62.66%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 31">
          <path d={svgPaths.p2deb8e00} fill="var(--fill-0, #932525)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[81.49%_37.07%_15.72%_62.1%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 5">
          <path d={svgPaths.p6421d50} fill="var(--fill-0, #932525)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[95.35%_16.1%_2.12%_82.52%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 5">
          <path d={svgPaths.p78d4a80} fill="var(--fill-0, #932525)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[72.41%_24.31%_24.9%_65.91%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 5">
          <path d={svgPaths.p855100} fill="var(--fill-0, #932525)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[54.5%_22.76%_32.47%_69.59%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 21">
          <path d={svgPaths.p4284780} fill="var(--fill-0, #BF7D4F)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[55.56%_24.58%_29.67%_65.97%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 24">
          <path d={svgPaths.p1ae5e832} fill="var(--fill-0, #EEAB93)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[60.96%_31.04%_34.11%_67.38%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 8">
          <path d={svgPaths.p1e4e5a00} fill="var(--fill-0, #CD807C)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[63.63%_25.14%_34.52%_73.58%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
          <path d={svgPaths.p1166eb80} fill="var(--fill-0, #CC807B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[59.59%_32.02%_39.23%_65.81%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 2">
          <path d={svgPaths.p2e100100} fill="var(--fill-0, #BF7D4F)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[59.84%_27.83%_38.59%_69.77%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 3">
          <path d={svgPaths.p2d5f7800} fill="var(--fill-0, #BF7D4F)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[50.88%_24.27%_42.78%_64.52%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 11">
          <path d={svgPaths.pe11fa00} fill="var(--fill-0, #BF7D4F)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[59.9%_24.14%_38.44%_73.62%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 3">
          <path d={svgPaths.p26e02900} fill="var(--fill-0, #AA663B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[61.35%_25.05%_37.62%_73.72%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 2">
          <path d={svgPaths.p31673100} fill="var(--fill-0, #AA663B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[55.58%_23.14%_42.73%_75.72%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
          <path d={svgPaths.p2a04a780} fill="var(--fill-0, #AA663B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[52.52%_24.76%_45.1%_73.57%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <path d={svgPaths.p308f6c80} fill="var(--fill-0, #AA663B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[52.71%_31.8%_43.29%_64.86%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
          <path d={svgPaths.p20294500} fill="var(--fill-0, #AA663B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[52.65%_33.9%_45.86%_65.46%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 3">
          <path d={svgPaths.p30585500} fill="var(--fill-0, #AA663B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[55.7%_26.98%_43.53%_70.8%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 2">
          <path d={svgPaths.p1f67e780} fill="var(--fill-0, #AA663B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[56.68%_27.02%_41.62%_72.64%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 3">
          <path d={svgPaths.p13a44b00} fill="var(--fill-0, #AA663B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[52.12%_30.9%_46.96%_67.11%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 2">
          <path d={svgPaths.p27ed4c00} fill="var(--fill-0, #AA663B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[61.74%_29.33%_37.07%_69.93%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
          <path d={svgPaths.p2f58b200} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[61.61%_28.65%_37.17%_69.8%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 2">
          <path d={svgPaths.p2e73a200} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[61.44%_32.8%_37.42%_66.51%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
          <path d={svgPaths.p3df1b700} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[61.3%_32.24%_37.54%_66.35%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 2">
          <path d={svgPaths.p2e344e80} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[66%_29.48%_31.77%_67.77%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 4">
          <path d={svgPaths.p2b618472} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[66.48%_29.78%_32.5%_68.41%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 2">
          <path d={svgPaths.pdd6b380} fill="var(--fill-0, #EEEBF2)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[82.81%_28.66%_15.22%_68.74%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 4">
          <path d={svgPaths.p23fa3700} fill="var(--fill-0, #932525)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[84.39%_29.38%_14.53%_69.1%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 2">
          <path d={svgPaths.p1ac80600} fill="var(--fill-0, #932525)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[29.31%_58.97%_56.15%_25.78%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 24">
          <path d={svgPaths.pf5aef80} fill="var(--fill-0, #E6D7D1)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[48.87%_9.56%_46.48%_87.4%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 8">
          <path d={svgPaths.p4c12180} fill="var(--fill-0, #F0E9E2)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[37.12%_7.05%_50.76%_78.8%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 20">
          <path d={svgPaths.p145f930} fill="var(--fill-0, #F0E9E2)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[39.47%_11.63%_60.13%_80.52%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 1">
          <path d={svgPaths.p27f8c500} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[39.47%_8.77%_60.13%_89.43%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 1">
          <path d={svgPaths.p1f8bdf80} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[41.23%_15.11%_58.38%_80.52%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 1">
          <path d={svgPaths.p10f37e40} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[41.23%_8.77%_58.38%_85.95%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 1">
          <path d={svgPaths.p10ad8900} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[42.98%_18.1%_56.62%_80.52%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 1">
          <path d={svgPaths.p18a56a80} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[42.98%_8.77%_56.62%_82.52%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 1">
          <path d={svgPaths.p2ef1db40} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[44.73%_12.63%_54.87%_80.52%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 1">
          <path d={svgPaths.p4bd9e00} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[44.73%_8.77%_54.87%_88.94%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 1">
          <path d={svgPaths.p7216a60} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[46.49%_15.11%_53.11%_82.4%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
          <path d={svgPaths.p11d68300} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[46.49%_11.56%_53.11%_85.7%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
          <path d={svgPaths.p1161f500} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[36.96%_6.92%_46.32%_78.68%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 27">
          <path d={svgPaths.p3205ca40} fill="var(--fill-0, #E6D7D1)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[5.19%_74.51%_82.68%_11.34%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 20">
          <path d={svgPaths.p8d47100} fill="var(--fill-0, #99B2D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[16.8%_83.51%_79.53%_12.86%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 6">
          <path d={svgPaths.p14cc4280} fill="var(--fill-0, #99B2D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[7.43%_76.23%_92.17%_15.92%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 1">
          <path d={svgPaths.p30695700} fill="var(--fill-0, #FAF6F3)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[7.43%_85.14%_92.17%_13.06%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 1">
          <path d={svgPaths.p34d08600} fill="var(--fill-0, #FAF6F3)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[9.18%_76.24%_90.42%_19.42%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 1">
          <path d={svgPaths.p34aba200} fill="var(--fill-0, #FAF6F3)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[9.18%_81.64%_90.42%_13.07%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 1">
          <path d={svgPaths.pfbfff30} fill="var(--fill-0, #FAF6F3)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[10.94%_76.23%_88.67%_22.4%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 1">
          <path d={svgPaths.pc6fbb80} fill="var(--fill-0, #FAF6F3)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[10.94%_78.22%_88.67%_13.06%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 1">
          <path d={svgPaths.p153e5d00} fill="var(--fill-0, #FAF6F3)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[12.69%_76.23%_86.91%_16.92%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 1">
          <path d={svgPaths.p3c748a00} fill="var(--fill-0, #FAF6F3)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[12.69%_84.64%_86.91%_13.06%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 1">
          <path d={svgPaths.pf0e2a00} fill="var(--fill-0, #FAF6F3)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[14.44%_78.11%_85.16%_19.42%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
          <path d={svgPaths.p13684f80} fill="var(--fill-0, #FAF6F3)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[14.44%_81.41%_85.16%_13.07%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 1">
          <path d={svgPaths.p13984100} fill="var(--fill-0, #FAF6F3)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[43.67%_87.53%_47.54%_5.6%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <path d={svgPaths.p3e187d10} fill="var(--fill-0, #FEB446)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[46.56%_91.91%_52.63%_7.45%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
          <path d={svgPaths.p35be8180} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[46.56%_89.39%_52.63%_9.98%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
          <path d={svgPaths.p27ccf500} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[48.37%_88.95%_49.78%_7.02%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 3">
          <path d={svgPaths.p30baa800} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[48.56%_89.28%_49.97%_7.35%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 3">
          <path d={svgPaths.p2f2bc800} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0.85%_56%_90.36%_37.13%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <path d={svgPaths.p29444f90} fill="var(--fill-0, #FEB446)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[5.55%_57.42%_92.6%_38.55%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 3">
          <path d={svgPaths.p21c88000} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[5.74%_57.75%_92.78%_38.88%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 3">
          <path d={svgPaths.p9c6fc00} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[3.62%_59.96%_95.44%_38.54%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 2">
          <path d={svgPaths.p14a1800} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[3.62%_57.41%_95.44%_41.09%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 2">
          <path d={svgPaths.p1d0e17f0} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[18.7%_12.36%_72.51%_80.78%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <path d={svgPaths.p3e187d10} fill="var(--fill-0, #FEB446)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[21.59%_16.74%_77.6%_82.63%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
          <path d={svgPaths.p9b18880} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[21.59%_14.21%_77.6%_85.16%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
          <path d={svgPaths.p2d8ba00} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[23.4%_13.77%_74.75%_82.19%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 3">
          <path d={svgPaths.p2d2f3100} fill="var(--fill-0, #5E5254)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[23.69%_14.16%_75.75%_82.59%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 1">
          <path d={svgPaths.p3e209480} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[3.59%_-0.05%_32.62%_69.72%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 63 103">
          <path d={svgPaths.pfd2b400} fill="var(--fill-0, #99B2D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[4.56%_28.89%_91.69%_65.6%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 7">
          <path d={svgPaths.p143f880} fill="var(--fill-0, #88A1BF)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[6.66%_27.18%_90.33%_65.6%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 5">
          <path d={svgPaths.p3e751870} fill="var(--fill-0, #99B2D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[1.31%_29.22%_92.03%_65.6%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <path d={svgPaths.p21abd500} fill="var(--fill-0, #99B2D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[67.58%_93.03%_26.65%_2.67%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 10">
          <path d={svgPaths.p8a6e700} fill="var(--fill-0, #88A1BF)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[64.3%_93.06%_26.64%_3.63%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 15">
          <path d={svgPaths.p14e94f00} fill="var(--fill-0, #99B2D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[68.75%_93.03%_26.65%_0.02%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 8">
          <path d={svgPaths.p3ce582c0} fill="var(--fill-0, #99B2D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute bottom-[31.13%] left-0 right-[75.72%] top-[31.4%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 51 61">
          <path d={svgPaths.p11affda0} fill="var(--fill-0, #99B2D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[12.32%_67.47%_84.08%_32%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
          <path d={svgPaths.p15aeaa00} fill="var(--fill-0, #99B2D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[13.8%_66.31%_85.52%_30.9%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 2">
          <path d={svgPaths.p354df1f2} fill="var(--fill-0, #99B2D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[41.96%_28.97%_54.52%_70.51%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
          <path d={svgPaths.p19553440} fill="var(--fill-0, #99B2D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[43.36%_27.81%_55.97%_69.41%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 2">
          <path d={svgPaths.p1dc86f00} fill="var(--fill-0, #99B2D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[7.89%_41.19%_88.58%_58.29%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
          <path d={svgPaths.p3d5b4000} fill="var(--fill-0, #FEB446)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[9.3%_40.03%_90.03%_57.19%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 2">
          <path d={svgPaths.p1f577c80} fill="var(--fill-0, #FEB446)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[59.85%_16.47%_36.62%_83.01%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
          <path d={svgPaths.p3558ee00} fill="var(--fill-0, #FEB446)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[61.26%_15.31%_38.07%_81.91%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 2">
          <path d={svgPaths.p19167080} fill="var(--fill-0, #FEB446)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[66.46%_83.55%_30.02%_15.93%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
          <path d={svgPaths.pc865200} fill="var(--fill-0, #FEB446)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[67.87%_82.38%_31.46%_14.77%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 2">
          <path d={svgPaths.p2667e800} fill="var(--fill-0, #FEB446)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[38.3%_80.19%_58.09%_19.28%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
          <path d={svgPaths.p29fdb400} fill="var(--fill-0, #B95A5A)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[39.79%_79.09%_59.54%_18.19%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 2">
          <path d={svgPaths.p38a5a380} fill="var(--fill-0, #B95A5A)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[20.85%_65.03%_75.63%_34.45%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
          <path d={svgPaths.p2d0a6b80} fill="var(--fill-0, #B95A5A)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[22.25%_63.87%_77.07%_33.29%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 2">
          <path d={svgPaths.p624a700} fill="var(--fill-0, #B95A5A)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[24.19%_3.78%_72.21%_95.7%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
          <path d={svgPaths.p2cd98600} fill="var(--fill-0, #B95A5A)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[25.68%_2.61%_73.65%_94.61%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 2">
          <path d={svgPaths.pa164800} fill="var(--fill-0, #B95A5A)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[24.06%_79.89%_73.6%_18.29%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <path d={svgPaths.p355a0600} fill="var(--fill-0, #FEB446)" id="Vector" />
        </svg>
      </div>
      <div className="absolute flex inset-[-0.02%_49.69%_97.64%_48.45%] items-center justify-center">
        <div className="flex-none rotate-[359.01deg] size-[3.763px]">
          <div className="relative size-full" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
              <path d={svgPaths.p955be00} fill="var(--fill-0, #99B2D6)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute inset-[13.93%_22.21%_83.74%_75.97%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <path d={svgPaths.p3ebe4c00} fill="var(--fill-0, #B95A5A)" id="Vector" />
        </svg>
      </div>
      <div className="absolute flex inset-[14.79%_48.09%_83.34%_50.45%] items-center justify-center">
        <div className="flex-none rotate-[283.34deg] size-[2.509px]">
          <div className="relative size-full" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
              <path d={svgPaths.p2567780} fill="var(--fill-0, #B95A5A)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[74.95%_10.37%_23.17%_88.17%] items-center justify-center">
        <div className="flex-none rotate-[283.34deg] size-[2.509px]">
          <div className="relative size-full" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
              <path d={svgPaths.p2bbba780} fill="var(--fill-0, #B95A5A)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[27.49%_94.05%_70.31%_4.23%] items-center justify-center">
        <div className="flex-none rotate-[315deg] size-[2.509px]">
          <div className="relative size-full" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
              <path d={svgPaths.p286aa080} fill="var(--fill-0, #99B2D6)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[4.53%_8.28%_93.27%_90%] items-center justify-center">
        <div className="flex-none rotate-[315deg] size-[2.509px]">
          <div className="relative size-full" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
              <path d={svgPaths.pb2c1240} fill="var(--fill-0, #99B2D6)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[81.5%_89.55%_16.63%_8.98%] items-center justify-center">
        <div className="flex-none rotate-[283.28deg] size-[2.509px]">
          <div className="relative size-full" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
              <path d={svgPaths.p34936d00} fill="var(--fill-0, #99B2D6)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[39.5%_24.35%_58.61%_74.18%] items-center justify-center">
        <div className="flex-none rotate-[283.96deg] size-[2.509px]">
          <div className="relative size-full" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
              <path d={svgPaths.p8cac770} fill="var(--fill-0, #FEB446)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[9.49%_91.23%_88.64%_7.31%] items-center justify-center">
        <div className="flex-none rotate-[283.23deg] size-[2.509px]">
          <div className="relative size-full" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
              <path d={svgPaths.p2cfcf380} fill="var(--fill-0, #FEB446)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute inset-[34.77%_45.07%_53.19%_45.55%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <path d={svgPaths.p29594200} fill="var(--fill-0, #F0AD95)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[39.65%_53.47%_53.44%_43.61%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 12">
          <path d={svgPaths.p268aa0f0} fill="var(--fill-0, #B95A5A)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[41.67%_45.55%_58.03%_53.19%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 1">
          <path d={svgPaths.p3fbfba80} fill="var(--fill-0, #CC807B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[44.93%_45.72%_54.77%_53.02%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 1">
          <path d={svgPaths.p1e46f180} fill="var(--fill-0, #CC807B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[43.27%_45.6%_56.43%_53.14%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 1">
          <path d={svgPaths.p1e3dacf2} fill="var(--fill-0, #CC807B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[44.93%_53.47%_53.44%_43.61%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 3">
          <path d={svgPaths.p342be700} fill="var(--fill-0, #A54E4E)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[39.99%_53.84%_59.59%_43.88%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 1">
          <path d={svgPaths.p398faa80} fill="var(--fill-0, #FFAA9F)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function WelcomeHelp() {
  return (
    <div className="absolute h-[193px] left-[calc(16.667%+83.978px)] top-[178px] w-[1149px]" data-name="WelcomeHelp">
      <div className="absolute bg-[#f4f6f7] inset-0 rounded-[3.288px]" data-name="WelcomeSubText">
        <div aria-hidden="true" className="absolute border-[#f4f6f7] border-[0.822px] border-solid inset-[-0.822px] pointer-events-none rounded-[4.10994px]" />
      </div>
      <div className="absolute flex flex-col font-['Poppins:SemiBold',sans-serif] inset-[9.98%_36.91%_74.47%_1.72%] justify-center leading-[0] not-italic text-[#0c1e33] text-[19.727px]">
        <p className="leading-[normal]">Hope you have a good day!</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Regular',sans-serif] inset-[35.53%_36.69%_43.6%_1.72%] justify-center leading-[0] not-italic text-[#495d72] text-[13.151px]">
        <p className="leading-[normal]">
          We are here to support you. Click<span className="font-['Poppins:ExtraBold',sans-serif] not-italic">{` learn more`}</span>
          <span>{` to explore about some tips to understand and manage your students better!`}</span>
        </p>
      </div>
      <LearnMore />
      <IsolationMode />
    </div>
  );
}

function VuesaxBoldNote2() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="vuesax/bold/note-2">
        <path d={svgPaths.p7fe0d00} fill="var(--fill-0, #0C1E33)" id="Vector" />
        <path d={svgPaths.p27cb5f80} fill="var(--fill-0, #0C1E33)" id="Vector_2" />
        <g id="Vector_3" opacity="0"></g>
      </g>
    </svg>
  );
}

function Frame83() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[9.863px] items-center p-[4.932px] relative size-full">
          <div className="relative shrink-0 size-[19.727px]" data-name="vuesax/bold/note-2">
            <VuesaxBoldNote2 />
          </div>
          <div className="basis-0 flex flex-col font-['Poppins:Medium',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#0c1e33] text-[13.151px]">
            <p className="leading-[normal]">Students Tracker</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentTableTitle() {
  return (
    <div className="absolute bottom-[92.47%] content-stretch flex gap-[9.863px] items-center left-0 right-[83.58%] top-0" data-name="StudentTableTitle">
      <Frame83 />
    </div>
  );
}

function Arrow3() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
      <g id="arrow-3">
        <g id="Vector" opacity="0"></g>
        <g id="Group 9">
          <path d={svgPaths.p1318f800} fill="var(--fill-0, #495D72)" id="Vector_2" stroke="var(--stroke-0, #495D72)" strokeWidth="0.115915" />
          <path d={svgPaths.p26ebd700} fill="var(--fill-0, #495D72)" id="Vector_3" stroke="var(--stroke-0, #495D72)" strokeWidth="0.115915" />
        </g>
      </g>
    </svg>
  );
}

function VuesaxBoldArrow3() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/arrow-3">
      <Arrow3 />
    </div>
  );
}

function Frame84() {
  return (
    <div className="content-stretch flex gap-[8.219px] items-center relative shrink-0 w-[177.54px]">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495d72] text-[11.507px] w-[91px]">
        <p className="leading-[normal]">Student Name</p>
      </div>
      <div className="relative shrink-0 size-[17.261px]" data-name="vuesax/bold/arrow-3">
        <VuesaxBoldArrow3 />
      </div>
    </div>
  );
}

function StudentNameColumn() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[19.727px] inset-[25.89%_82.23%_4.29%_2.97%] items-start" data-name="StudentNameColumn">
      <Frame84 />
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Duong Gia An</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Huynh Duc Nham</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Vo Duong Xuan Nguyen</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Nguyen Van Teo</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Le Thi Be</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Truong Van Tuan</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Huynh Thi Ngoc</p>
      </div>
    </div>
  );
}

function Arrow4() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
      <g id="arrow-3">
        <g id="Vector" opacity="0"></g>
        <g id="Group 9">
          <path d={svgPaths.p1318f800} fill="var(--fill-0, #495D72)" id="Vector_2" stroke="var(--stroke-0, #495D72)" strokeWidth="0.115915" />
          <path d={svgPaths.p26ebd700} fill="var(--fill-0, #495D72)" id="Vector_3" stroke="var(--stroke-0, #495D72)" strokeWidth="0.115915" />
        </g>
      </g>
    </svg>
  );
}

function VuesaxBoldArrow4() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/arrow-3">
      <Arrow4 />
    </div>
  );
}

function Frame85() {
  return (
    <div className="content-stretch flex gap-[8.219px] items-center relative shrink-0 w-[78.907px]">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495d72] text-[11.507px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Age</p>
      </div>
      <div className="relative shrink-0 size-[17.261px]" data-name="vuesax/bold/arrow-3">
        <VuesaxBoldArrow4 />
      </div>
    </div>
  );
}

function AgeColumn() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[19.727px] inset-[25.89%_70.73%_4.29%_22.7%] items-start" data-name="AgeColumn">
      <Frame85 />
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">24</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">23</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">23</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">21</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">22</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">25</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">23</p>
      </div>
    </div>
  );
}

function Arrow5() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
      <g id="arrow-3">
        <g id="Vector" opacity="0"></g>
        <g id="Group 9">
          <path d={svgPaths.p2d5e9780} fill="var(--fill-0, #495D72)" id="Vector_2" stroke="var(--stroke-0, #495D72)" strokeWidth="0.115915" />
          <path d={svgPaths.p35efff00} fill="var(--fill-0, #495D72)" id="Vector_3" stroke="var(--stroke-0, #495D72)" strokeWidth="0.115915" />
        </g>
      </g>
    </svg>
  );
}

function VuesaxBoldArrow5() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/arrow-3">
      <Arrow5 />
    </div>
  );
}

function Frame86() {
  return (
    <div className="content-stretch flex gap-[8.219px] items-center relative shrink-0 w-[78.907px]">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495d72] text-[11.507px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Course</p>
      </div>
      <div className="relative shrink-0 size-[17.261px]" data-name="vuesax/bold/arrow-3">
        <VuesaxBoldArrow5 />
      </div>
    </div>
  );
}

function CourceColumn() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col gap-[19.727px] items-start left-[32.16%] right-[58.34%] top-[26.7%]" data-name="CourceColumn">
      <Frame86 />
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Computer Science</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Computer Science</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Computer Science</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Mechanical</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Electrical</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[114px]">
        <p className="leading-[normal]">Electrical</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Environmental</p>
      </div>
    </div>
  );
}

function Arrow6() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
      <g id="arrow-3">
        <g id="Vector" opacity="0"></g>
        <g id="Group 9">
          <path d={svgPaths.p2d5e9780} fill="var(--fill-0, #495D72)" id="Vector_2" stroke="var(--stroke-0, #495D72)" strokeWidth="0.115915" />
          <path d={svgPaths.p35efff00} fill="var(--fill-0, #495D72)" id="Vector_3" stroke="var(--stroke-0, #495D72)" strokeWidth="0.115915" />
        </g>
      </g>
    </svg>
  );
}

function VuesaxBoldArrow6() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/arrow-3">
      <Arrow6 />
    </div>
  );
}

function Frame87() {
  return (
    <div className="content-stretch flex gap-[8.219px] items-center relative shrink-0 w-[78.907px]">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495d72] text-[11.507px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Gender</p>
      </div>
      <div className="relative shrink-0 size-[17.261px]" data-name="vuesax/bold/arrow-3">
        <VuesaxBoldArrow6 />
      </div>
    </div>
  );
}

function GenderColumn() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[19.727px] inset-[25.89%_47.71%_4.29%_45.71%] items-start" data-name="GenderColumn">
      <Frame87 />
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Male</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Male</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Male</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Male</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Female</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Male</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">Female</p>
      </div>
    </div>
  );
}

function Arrow7() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
      <g id="arrow-3">
        <g id="Vector" opacity="0"></g>
        <g id="Group 9">
          <path d={svgPaths.p2d5e9780} fill="var(--fill-0, #495D72)" id="Vector_2" stroke="var(--stroke-0, #495D72)" strokeWidth="0.115915" />
          <path d={svgPaths.p29504200} fill="var(--fill-0, #495D72)" id="Vector_3" stroke="var(--stroke-0, #495D72)" strokeWidth="0.115915" />
        </g>
      </g>
    </svg>
  );
}

function VuesaxBoldArrow7() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/arrow-3">
      <Arrow7 />
    </div>
  );
}

function Frame88() {
  return (
    <div className="content-stretch flex gap-[8.219px] items-center relative shrink-0 w-[95.346px]">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495d72] text-[11.507px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">CGPA</p>
      </div>
      <div className="relative shrink-0 size-[17.261px]" data-name="vuesax/bold/arrow-3">
        <VuesaxBoldArrow7 />
      </div>
    </div>
  );
}

function CgpaColumn() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[19.727px] inset-[25.89%_34.84%_4.29%_57.22%] items-start" data-name="CGPAColumn">
      <Frame88 />
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">3.5</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">3.7</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">3.2</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">2.9</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">2.2</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">3.4</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0c1e33] text-[11.507px] w-[min-content]">
        <p className="leading-[normal]">2.5</p>
      </div>
    </div>
  );
}

function Arrow8() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
      <g id="arrow-3">
        <g id="Vector" opacity="0"></g>
        <g id="Group 9">
          <path d={svgPaths.p2d5e9780} fill="var(--fill-0, #495D72)" id="Vector_2" stroke="var(--stroke-0, #495D72)" strokeWidth="0.115915" />
          <path d={svgPaths.p29504200} fill="var(--fill-0, #495D72)" id="Vector_3" stroke="var(--stroke-0, #495D72)" strokeWidth="0.115915" />
        </g>
      </g>
    </svg>
  );
}

function VuesaxBoldArrow8() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/arrow-3">
      <Arrow8 />
    </div>
  );
}

function Frame89() {
  return (
    <div className="content-stretch flex gap-[8.219px] items-center relative shrink-0 w-[78.907px]">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495d72] text-[11.507px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Stress Level</p>
      </div>
      <div className="relative shrink-0 size-[17.261px]" data-name="vuesax/bold/arrow-3">
        <VuesaxBoldArrow8 />
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#ffaa9f] box-border content-stretch flex gap-[8.219px] h-[17px] items-center justify-center p-[3.288px] relative rounded-[1.644px] shrink-0 w-[79px]">
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0c1e33] text-[9.863px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">4</p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="bg-[#f4bd50] box-border content-stretch flex gap-[8.219px] h-[18px] items-center justify-center p-[3.288px] relative rounded-[1.644px] shrink-0 w-[79px]">
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0c1e33] text-[9.863px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">3</p>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="bg-[#ed6a5e] box-border content-stretch flex gap-[8.219px] h-[17px] items-center justify-center p-[3.288px] relative rounded-[1.644px] shrink-0 w-[79px]">
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0c1e33] text-[9.863px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">5</p>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#cbe6f0] box-border content-stretch flex gap-[8.219px] h-[17px] items-center justify-center p-[3.288px] relative rounded-[1.644px] shrink-0 w-[79px]">
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0c1e33] text-[9.863px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">2</p>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[#cbe6f0] box-border content-stretch flex gap-[8.219px] h-[16px] items-center justify-center p-[3.288px] relative rounded-[1.644px] shrink-0 w-[79px]">
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0c1e33] text-[9.863px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">2</p>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[#ffaa9f] box-border content-stretch flex gap-[8.219px] h-[21px] items-center justify-center p-[3.288px] relative rounded-[1.644px] shrink-0 w-[79px]">
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0c1e33] text-[9.863px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">4</p>
      </div>
    </div>
  );
}

function StreeLevelColumn() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[19.727px] inset-[25.94%_8.34%_3.22%_84.91%] items-start" data-name="StreeLevelColumn">
      <Frame89 />
      {[...Array(2).keys()].map((_, i) => (
        <Frame9 key={i} />
      ))}
      <Frame11 />
      <Frame12 />
      <Frame13 />
      <Frame14 />
      <Frame15 />
    </div>
  );
}

function More() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="more">
        <path d={svgPaths.p495c100} fill="var(--fill-0, #0C1E33)" id="Vector" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <path d={svgPaths.p3061ba00} fill="var(--fill-0, #0C1E33)" id="Vector_2" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <path d={svgPaths.p16a0b880} fill="var(--fill-0, #0C1E33)" id="Vector_3" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <g id="Vector_4" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxLinearMore() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/more">
      <More />
    </div>
  );
}

function More1() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="more">
        <path d={svgPaths.p495c100} fill="var(--fill-0, #0C1E33)" id="Vector" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <path d={svgPaths.p3061ba00} fill="var(--fill-0, #0C1E33)" id="Vector_2" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <path d={svgPaths.p16a0b880} fill="var(--fill-0, #0C1E33)" id="Vector_3" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <g id="Vector_4" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxLinearMore1() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/more">
      <More1 />
    </div>
  );
}

function More2() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="more">
        <path d={svgPaths.p495c100} fill="var(--fill-0, #0C1E33)" id="Vector" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <path d={svgPaths.p3061ba00} fill="var(--fill-0, #0C1E33)" id="Vector_2" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <path d={svgPaths.p16a0b880} fill="var(--fill-0, #0C1E33)" id="Vector_3" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <g id="Vector_4" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxLinearMore2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/more">
      <More2 />
    </div>
  );
}

function More3() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="more">
        <path d={svgPaths.p495c100} fill="var(--fill-0, #0C1E33)" id="Vector" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <path d={svgPaths.p3061ba00} fill="var(--fill-0, #0C1E33)" id="Vector_2" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <path d={svgPaths.p16a0b880} fill="var(--fill-0, #0C1E33)" id="Vector_3" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <g id="Vector_4" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxLinearMore3() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/more">
      <More3 />
    </div>
  );
}

function More4() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="more">
        <path d={svgPaths.p495c100} fill="var(--fill-0, #0C1E33)" id="Vector" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <path d={svgPaths.p3061ba00} fill="var(--fill-0, #0C1E33)" id="Vector_2" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <path d={svgPaths.p16a0b880} fill="var(--fill-0, #0C1E33)" id="Vector_3" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <g id="Vector_4" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxLinearMore4() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/more">
      <More4 />
    </div>
  );
}

function More5() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="more">
        <path d={svgPaths.p495c100} fill="var(--fill-0, #0C1E33)" id="Vector" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <path d={svgPaths.p3061ba00} fill="var(--fill-0, #0C1E33)" id="Vector_2" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <path d={svgPaths.p16a0b880} fill="var(--fill-0, #0C1E33)" id="Vector_3" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <g id="Vector_4" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxLinearMore5() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/more">
      <More5 />
    </div>
  );
}

function More6() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="more">
        <path d={svgPaths.p495c100} fill="var(--fill-0, #0C1E33)" id="Vector" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <path d={svgPaths.p3061ba00} fill="var(--fill-0, #0C1E33)" id="Vector_2" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <path d={svgPaths.p16a0b880} fill="var(--fill-0, #0C1E33)" id="Vector_3" stroke="var(--stroke-0, #0C1E33)" strokeWidth="0.821944" />
        <g id="Vector_4" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxLinearMore6() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/more">
      <More6 />
    </div>
  );
}

function MoreColumn() {
  return (
    <div className="absolute contents inset-[35.09%_5.28%_3.4%_93.08%]" data-name="MoreColumn">
      <div className="absolute flex inset-[35.09%_5.28%_59.88%_93.08%] items-center justify-center">
        <div className="flex-none rotate-[270deg] size-[19.727px]">
          <div className="relative size-full" data-name="vuesax/linear/more">
            <VuesaxLinearMore />
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[44.51%_5.28%_50.47%_93.08%] items-center justify-center">
        <div className="flex-none rotate-[270deg] size-[19.727px]">
          <div className="relative size-full" data-name="vuesax/linear/more">
            <VuesaxLinearMore1 />
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[53.92%_5.28%_41.06%_93.08%] items-center justify-center">
        <div className="flex-none rotate-[270deg] size-[19.727px]">
          <div className="relative size-full" data-name="vuesax/linear/more">
            <VuesaxLinearMore2 />
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[63.33%_5.28%_31.64%_93.08%] items-center justify-center">
        <div className="flex-none rotate-[270deg] size-[19.727px]">
          <div className="relative size-full" data-name="vuesax/linear/more">
            <VuesaxLinearMore3 />
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[72.75%_5.28%_22.23%_93.08%] items-center justify-center">
        <div className="flex-none rotate-[270deg] size-[19.727px]">
          <div className="relative size-full" data-name="vuesax/linear/more">
            <VuesaxLinearMore4 />
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[82.16%_5.28%_12.82%_93.08%] items-center justify-center">
        <div className="flex-none rotate-[270deg] size-[19.727px]">
          <div className="relative size-full" data-name="vuesax/linear/more">
            <VuesaxLinearMore5 />
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[91.58%_5.28%_3.4%_93.08%] items-center justify-center">
        <div className="flex-none rotate-[270deg] size-[19.727px]">
          <div className="relative size-full" data-name="vuesax/linear/more">
            <VuesaxLinearMore6 />
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowLeft() {
  return (
    <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[19.727px]" data-name="arrow-left">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="arrow-left">
          <path d={svgPaths.p23330400} id="Vector" stroke="var(--stroke-0, #292D32)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.23292" />
          <g id="Vector_2" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxLinearArrowLeft() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="vuesax/linear/arrow-left">
      <ArrowLeft />
    </div>
  );
}

function ArrowLeft1() {
  return (
    <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[19.727px]" data-name="arrow-left">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="arrow-left">
          <path d={svgPaths.p24249800} id="Vector" stroke="var(--stroke-0, #292D32)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.23292" />
          <g id="Vector_2" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxLinearArrowLeft1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative" data-name="vuesax/linear/arrow-left">
      <ArrowLeft1 />
    </div>
  );
}

function Pageination() {
  return (
    <div className="absolute bottom-[93.71%] content-stretch flex gap-[8.219px] items-center justify-center left-[81.16%] overflow-clip right-0 top-[1.27%]" data-name="Pageination">
      <VuesaxLinearArrowLeft />
      <div className="box-border content-stretch flex h-[19.727px] items-center justify-center px-[4.932px] py-[1.644px] relative rounded-[4px] shrink-0" data-name="Atoms / Mouth">
        <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0c1e33] text-[9.86px] text-center text-nowrap">
          <p className="leading-[normal] whitespace-pre">
            <span>{`...  `}</span>
            <span className="text-[rgba(12,30,51,0.4)]">1</span> <span className="font-['Poppins:Bold',sans-serif] not-italic">2</span> <span className="text-[rgba(12,30,51,0.4)]">{`3 `}</span>
            <span>{` ...`}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center leading-[0] relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <VuesaxLinearArrowLeft1 />
        </div>
      </div>
    </div>
  );
}

function SearchNormal() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="search-normal">
        <g id="Group 1">
          <path d={svgPaths.p281ff300} fill="var(--fill-0, #495D72)" id="Vector" />
          <path d={svgPaths.p23692a80} fill="var(--fill-0, #495D72)" id="Vector_2" />
        </g>
        <g id="Vector_3" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldSearchNormal() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/search-normal">
      <SearchNormal />
    </div>
  );
}

function SearchBar() {
  return (
    <div className="absolute bg-[#f5f6f8] box-border content-stretch flex gap-[9.863px] h-[29.59px] items-center left-[calc(50%+371.468px)] px-[13.151px] py-[4.932px] rounded-[4.932px] top-[34px] translate-x-[-50%] w-[350.97px]" data-name="Search bar">
      <div aria-hidden="true" className="absolute border-[#ebedf2] border-[0.493px] border-solid inset-[-0.247px] pointer-events-none rounded-[5.179px]" />
      <div className="basis-0 capitalize flex flex-col font-['Poppins:Medium',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[11.507px] text-[rgba(73,93,114,0.6)]">
        <p className="leading-[normal]">Search......</p>
      </div>
      <div className="relative shrink-0 size-[19.727px]" data-name="vuesax/bold/search-normal">
        <VuesaxBoldSearchNormal />
      </div>
    </div>
  );
}

function SutdentTable() {
  return (
    <div className="absolute h-[392.921px] left-[calc(16.667%+77.978px)] top-[396px] w-[1200.03px]" data-name="SutdentTable">
      <StudentTableTitle />
      <div className="absolute bg-[#f4f6f7] inset-[32.07%_4.42%_56.99%_0.92%]" />
      <div className="absolute bg-[#f4f6f7] inset-[50.65%_4.42%_38.41%_0.92%]" />
      <div className="absolute bg-[#f4f6f7] inset-[69.73%_4.42%_19.32%_0.92%]" />
      <div className="absolute bg-[#f4f6f7] inset-[88.57%_4.42%_0.49%_0.92%]" />
      <div className="absolute inset-[20.87%_4.42%_79.13%_0.92%]">
        <div className="absolute inset-[-0.41px_-0.04%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1137 1">
            <path d="M0.410972 0.410972H1136.41" id="Line 22" stroke="var(--stroke-0, #CED8E5)" strokeLinecap="round" strokeWidth="0.821944" />
          </svg>
        </div>
      </div>
      <StudentNameColumn />
      <AgeColumn />
      <CourceColumn />
      <GenderColumn />
      <CgpaColumn />
      <StreeLevelColumn />
      <MoreColumn />
      <Pageination />
      <SearchBar />
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
    <div className="absolute bg-gradient-to-r box-border content-stretch flex from-[8.571%] from-[rgba(255,255,255,0.1)] gap-[9.863px] items-center left-[49.32px] px-[13.151px] py-[9.863px] rounded-bl-[4.932px] rounded-tl-[4.932px] to-[rgba(255,255,255,0)] top-[123.29px] w-[201.376px]" data-name="Dashboard">
      <div aria-hidden="true" className="absolute border-[0px_0px_0px_4.932px] border-solid border-white inset-0 pointer-events-none rounded-bl-[4.932px] rounded-tl-[4.932px]" />
      <div className="relative shrink-0 size-[19.727px]" data-name="vuesax/bold/element-4">
        <VuesaxBoldElement4 />
      </div>
      <div className="basis-0 capitalize flex flex-col font-['Poppins:SemiBold',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[11.507px] text-white">
        <p className="leading-[normal]">Dashboard</p>
      </div>
    </div>
  );
}

function VuesaxBoldBook() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
      <g id="vuesax/bold/book">
        <path d={svgPaths.p8fcdd00} fill="var(--fill-0, white)" id="Vector" />
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
      <div className="capitalize flex flex-col font-['Alumni_Sans_Inline_One:Regular',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white w-[118px]">
        <p className="leading-[normal]">Supervisor Space</p>
      </div>
    </div>
  );
}

function Logout() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="logout">
        <path d={svgPaths.p37611800} fill="var(--fill-0, white)" id="Vector" />
        <path d={svgPaths.p28a1ad00} fill="var(--fill-0, white)" id="Vector_2" />
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
    <div className="absolute box-border content-stretch flex gap-[9.863px] h-[39.453px] items-center left-[47px] overflow-clip px-[13.151px] py-[9.863px] top-[204px] w-[201.376px]" data-name="Logout">
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
    <div className="absolute box-border content-stretch flex gap-[9.863px] h-[39.453px] items-center left-[47px] overflow-clip px-[13.151px] py-[9.863px] top-[242px] w-[201.376px]" data-name="Help">
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
      <div className="absolute bottom-[83.27%] left-0 right-0 top-[16.73%]">
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
      <Dashboard />
      <Logo />
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

function Dashboard1() {
  return (
    <div className="absolute bg-white h-[1117.84px] left-[78px] overflow-clip rounded-[30px] shadow-[0px_5.94px_23.761px_0px_rgba(12,30,51,0.12)] top-[75px] w-[1578.13px]" data-name="Dashboard">
      <Welcome />
      <Header />
      <WelcomeHelp />
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(91.667%+8.878px)] not-italic text-[#495d72] text-[8.219px] text-center text-nowrap top-[146.55px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">1 Nov 2025, Monday</p>
      </div>
      <SutdentTable />
      <Sidebar />
      <IntegratedTitleBarAndToolbar />
    </div>
  );
}

export default function TeacherSupervisorDashboard() {
  return (
    <div className="overflow-clip relative rounded-[60px] size-full" data-name="[Teacher/Supervisor] Dashboard">
      <Dashboard1 />
    </div>
  );
}