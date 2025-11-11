import { Student } from "../data/mockStudents";
import { MentalHealthRecord } from "../data/mockMentalHealth";
import svgPaths from "../imports/svg-z8cvstqqyu";

interface StudentDetailPageProps {
  student: Student;
  mentalHealth?: MentalHealthRecord;
  onBack: () => void;
}

function ArrowLeft() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="arrow-left">
        <path d="M12.5 16.6L6.96667 11.0667C6.425 10.525 6.425 9.64167 6.96667 9.1L12.5 3.56667" stroke="var(--stroke-0, #0c1e33)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.64389" />
      </g>
    </svg>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#CED8E5] rounded-[3.288px] p-6">
      <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#0c1e33] mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-start py-3 border-b border-[#f4f6f7] last:border-0">
      <span className="font-['Poppins:Regular',sans-serif] text-[11.507px] text-[#495d72]">
        {label}
      </span>
      <span className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#0c1e33] text-right">
        {value}
      </span>
    </div>
  );
}

export function StudentDetailPage({ student, mentalHealth, onBack }: StudentDetailPageProps) {
  const getStatusColor = (status: Student["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "graduated":
        return "bg-blue-500";
      case "suspended":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStressLevelColor = (level: number) => {
    if (level <= 2) return "bg-[#cbe6f0]";
    if (level === 3) return "bg-[#f4bd50]";
    if (level === 4) return "bg-[#ffaa9f]";
    return "bg-[#ed6a5e]";
  };

  const getRiskLevelColor = (risk: string) => {
    if (risk === "low") return "text-green-600";
    if (risk === "moderate") return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-[#f4f6f7]">
      {/* Header */}
      <div className="bg-white border-b border-[#CED8E5] px-8 py-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 mb-4 hover:opacity-70 transition-opacity"
        >
          <div className="size-[20px]">
            <ArrowLeft />
          </div>
          <span className="font-['Poppins:Medium',sans-serif] text-[13.151px] text-[#0c1e33]">
            Back to Dashboard
          </span>
        </button>
        <h1 className="font-['Poppins:SemiBold',sans-serif] text-[24px] text-[#0c1e33]">
          Student Information Detail
        </h1>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        {/* Student Header Card */}
        <div className="bg-white border border-[#CED8E5] rounded-[3.288px] p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="size-[120px] rounded-full overflow-hidden bg-[#f4f6f7] flex-shrink-0">
              {student.avatar ? (
                <img src={student.avatar} alt={`${student.firstName} ${student.lastName}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-['Poppins:SemiBold',sans-serif] text-[40px] text-[#495d72]">
                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-['Poppins:SemiBold',sans-serif] text-[24px] text-[#0c1e33]">
                  {student.firstName} {student.lastName}
                </h2>
                <div className={`${getStatusColor(student.status)} px-3 py-1 rounded-[1.644px]`}>
                  <span className="font-['Poppins:Medium',sans-serif] text-[9.863px] text-white capitalize">
                    {student.status}
                  </span>
                </div>
              </div>
              
              <p className="font-['Poppins:Regular',sans-serif] text-[13.151px] text-[#495d72] mb-4">
                Student ID: {student.studentId}
              </p>
              
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[9.863px] text-[#495d72] mb-1">
                    Major
                  </p>
                  <p className="font-['Poppins:Medium',sans-serif] text-[13.151px] text-[#0c1e33]">
                    {student.major}
                  </p>
                </div>
                <div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[9.863px] text-[#495d72] mb-1">
                    Year
                  </p>
                  <p className="font-['Poppins:Medium',sans-serif] text-[13.151px] text-[#0c1e33]">
                    {student.year}
                  </p>
                </div>
                <div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[9.863px] text-[#495d72] mb-1">
                    GPA
                  </p>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[19.727px] text-[#0c1e33]">
                    {student.gpa.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Personal Information */}
          <InfoCard title="Personal Information">
            <InfoRow label="Date of Birth" value={new Date(student.dateOfBirth).toLocaleDateString()} />
            <InfoRow label="Email" value={student.email} />
            <InfoRow label="Phone" value={student.phone} />
            <InfoRow label="Address" value={student.address} />
            <InfoRow label="Enrollment Date" value={new Date(student.enrollmentDate).toLocaleDateString()} />
          </InfoCard>

          {/* Emergency Contact */}
          <InfoCard title="Emergency Contact">
            <InfoRow label="Name" value={student.emergencyContact.name} />
            <InfoRow label="Relationship" value={student.emergencyContact.relationship} />
            <InfoRow label="Phone" value={student.emergencyContact.phone} />
          </InfoCard>
        </div>

        {/* Mental Health Information */}
        {mentalHealth && (
          <>
            <div className="mb-6">
              <InfoCard title="Mental Health Status - Primary Indicators">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-[#f4f6f7] rounded p-3">
                    <p className="font-['Poppins:Regular',sans-serif] text-[9.863px] text-[#495d72] mb-2">
                      Stress Level
                    </p>
                    <div className={`${getStressLevelColor(mentalHealth.stressLevel)} px-3 py-1 rounded-[1.644px] inline-block`}>
                      <span className="font-['Poppins:SemiBold',sans-serif] text-[13.151px] text-[#0c1e33]">
                        {mentalHealth.stressLevel}/5
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-[#f4f6f7] rounded p-3">
                    <p className="font-['Poppins:Regular',sans-serif] text-[9.863px] text-[#495d72] mb-2">
                      Depression Score
                    </p>
                    <div className={`${getStressLevelColor(mentalHealth.depressionScore)} px-3 py-1 rounded-[1.644px] inline-block`}>
                      <span className="font-['Poppins:SemiBold',sans-serif] text-[13.151px] text-[#0c1e33]">
                        {mentalHealth.depressionScore}/5
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-[#f4f6f7] rounded p-3">
                    <p className="font-['Poppins:Regular',sans-serif] text-[9.863px] text-[#495d72] mb-2">
                      Anxiety Score
                    </p>
                    <div className={`${getStressLevelColor(mentalHealth.anxietyScore)} px-3 py-1 rounded-[1.644px] inline-block`}>
                      <span className="font-['Poppins:SemiBold',sans-serif] text-[13.151px] text-[#0c1e33]">
                        {mentalHealth.anxietyScore}/5
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-[#f4f6f7] rounded p-3">
                    <p className="font-['Poppins:Regular',sans-serif] text-[9.863px] text-[#495d72] mb-2">
                      Risk Level
                    </p>
                    <p className={`font-['Poppins:SemiBold',sans-serif] text-[13.151px] capitalize ${getRiskLevelColor(mentalHealth.riskLevel)}`}>
                      {mentalHealth.riskLevel}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-[#f4f6f7] pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[9.863px] text-[#495d72] mb-2">
                        Counseling Sessions
                      </p>
                      <p className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#0c1e33]">
                        {mentalHealth.counselingSessions} sessions
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[9.863px] text-[#495d72] mb-2">
                        Last Check-in
                      </p>
                      <p className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#0c1e33]">
                        {new Date(mentalHealth.lastCheckIn).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="font-['Poppins:Regular',sans-serif] text-[9.863px] text-[#495d72] mb-2">
                      Notes
                    </p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[11.507px] text-[#0c1e33]">
                      {mentalHealth.notes}
                    </p>
                  </div>
                </div>
              </InfoCard>
            </div>

            {/* Lifestyle & Wellness Factors */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <InfoCard title="Sleep & Physical Health">
                <InfoRow label="Sleep Hours" value={`${mentalHealth.sleepHours}h`} />
                <InfoRow label="Sleep Quality" value={mentalHealth.sleepQuality} />
                <InfoRow label="Physical Activity" value={mentalHealth.physicalActivity} />
                <InfoRow label="Diet Quality" value={mentalHealth.dietQuality} />
              </InfoCard>

              <InfoCard title="Social & Environmental Factors">
                <InfoRow label="Social Support" value={`${mentalHealth.socialSupport}/5`} />
                <InfoRow label="Financial Stress" value={`${mentalHealth.financialStress}/5`} />
                <InfoRow label="Semester Credit Load" value={`${mentalHealth.semesterCreditLoad} credits`} />
                <InfoRow label="Substance Use" value={mentalHealth.substanceUse} />
              </InfoCard>
            </div>

            {/* Medical History */}
            <div className="mb-6">
              <InfoCard title="Medical History">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#f4f6f7] rounded p-4">
                    <p className="font-['Poppins:Regular',sans-serif] text-[9.863px] text-[#495d72] mb-2">
                      Family History of Mental Health Issues
                    </p>
                    <p className={`font-['Poppins:SemiBold',sans-serif] text-[13.151px] ${mentalHealth.familyHistory === 'Yes' ? 'text-[#ed6a5e]' : 'text-green-600'}`}>
                      {mentalHealth.familyHistory}
                    </p>
                  </div>
                  
                  <div className="bg-[#f4f6f7] rounded p-4">
                    <p className="font-['Poppins:Regular',sans-serif] text-[9.863px] text-[#495d72] mb-2">
                      Chronic Illness
                    </p>
                    <p className={`font-['Poppins:SemiBold',sans-serif] text-[13.151px] ${mentalHealth.chronicIllness === 'Yes' ? 'text-[#ed6a5e]' : 'text-green-600'}`}>
                      {mentalHealth.chronicIllness}
                    </p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </>
        )}

        {/* Academic Performance History */}
        <div className="mb-6">
          <InfoCard title="Academic Performance History">
            <div className="space-y-3">
              {student.performance.slice().reverse().map((sem, index) => (
                <div key={index} className="bg-[#f4f6f7] rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#0c1e33]">
                      {sem.semester}
                    </span>
                    <span className="font-['Poppins:SemiBold',sans-serif] text-[13.151px] text-[#0c1e33]">
                      {sem.gpa.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-1.5">
                    <div 
                      className="bg-[#0c1e33] h-1.5 rounded-full transition-all"
                      style={{ width: `${(sem.gpa / 4) * 100}%` }}
                    />
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[9.863px] text-[#495d72] mt-1">
                    {sem.credits} credits
                  </p>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
