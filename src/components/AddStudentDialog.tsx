import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Student } from "../data/mockStudents";
import { MentalHealthRecord } from "../data/mockMentalHealth";

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStudent: (student: Student, mentalHealth: MentalHealthRecord) => void;
}

export function AddStudentDialog({ open, onOpenChange, onAddStudent }: AddStudentDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    major: "Computer Science",
    year: "Freshman",
    gpa: "3.5",
    stressLevel: "2",
    moodRating: "4",
    sleepHours: "7",
    age: "20",
    gender: "Male"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const studentId = `STU${Date.now()}`;
    const id = Date.now().toString();
    
    const newStudent: Student = {
      id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      enrollmentDate: new Date().toISOString().split('T')[0],
      studentId,
      major: formData.major,
      year: formData.year,
      gpa: parseFloat(formData.gpa),
      status: "active",
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.random() * 100000000}?w=400&h=400&fit=crop`,
      emergencyContact: {
        name: "",
        relationship: "",
        phone: ""
      },
      courses: [],
      attendance: {
        present: 0,
        absent: 0,
        late: 0,
        totalClasses: 0
      },
      performance: []
    };

    const newMentalHealth: MentalHealthRecord = {
      id,
      studentName: `${formData.firstName} ${formData.lastName}`,
      age: parseInt(formData.age),
      course: formData.major,
      stressLevel: parseInt(formData.stressLevel),
      moodRating: parseInt(formData.moodRating),
      sleepHours: parseFloat(formData.sleepHours),
      counselingSessions: 0,
      lastCheckIn: new Date().toISOString().split('T')[0],
      riskLevel: parseInt(formData.stressLevel) >= 4 ? "high" : parseInt(formData.stressLevel) >= 3 ? "moderate" : "low",
      notes: "New student entry"
    };

    onAddStudent(newStudent, newMentalHealth);
    
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      major: "Computer Science",
      year: "Freshman",
      gpa: "3.5",
      stressLevel: "2",
      moodRating: "4",
      sleepHours: "7",
      age: "20",
      gender: "Male"
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-['Poppins:SemiBold',sans-serif] text-[19.727px] text-[#0c1e33]">
            Add New Student
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#495d72]">
                First Name *
              </Label>
              <Input
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="font-['Poppins:Regular',sans-serif] text-[11.507px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#495d72]">
                Last Name *
              </Label>
              <Input
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="font-['Poppins:Regular',sans-serif] text-[11.507px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#495d72]">
                Email *
              </Label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="font-['Poppins:Regular',sans-serif] text-[11.507px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#495d72]">
                Phone
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="font-['Poppins:Regular',sans-serif] text-[11.507px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#495d72]">
                Date of Birth *
              </Label>
              <Input
                required
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="font-['Poppins:Regular',sans-serif] text-[11.507px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#495d72]">
                Age *
              </Label>
              <Input
                required
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="font-['Poppins:Regular',sans-serif] text-[11.507px]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#495d72]">
              Address
            </Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="font-['Poppins:Regular',sans-serif] text-[11.507px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#495d72]">
                Major *
              </Label>
              <Select value={formData.major} onValueChange={(value) => setFormData({ ...formData, major: value })}>
                <SelectTrigger className="font-['Poppins:Regular',sans-serif] text-[11.507px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                  <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                  <SelectItem value="Environmental Science">Environmental Science</SelectItem>
                  <SelectItem value="Business Administration">Business Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#495d72]">
                Year *
              </Label>
              <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                <SelectTrigger className="font-['Poppins:Regular',sans-serif] text-[11.507px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Freshman">Freshman</SelectItem>
                  <SelectItem value="Sophomore">Sophomore</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Graduate">Graduate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#495d72]">
                GPA *
              </Label>
              <Input
                required
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                className="font-['Poppins:Regular',sans-serif] text-[11.507px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#495d72]">
                Stress Level (1-5) *
              </Label>
              <Select value={formData.stressLevel} onValueChange={(value) => setFormData({ ...formData, stressLevel: value })}>
                <SelectTrigger className="font-['Poppins:Regular',sans-serif] text-[11.507px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Very Low</SelectItem>
                  <SelectItem value="2">2 - Low</SelectItem>
                  <SelectItem value="3">3 - Medium</SelectItem>
                  <SelectItem value="4">4 - High</SelectItem>
                  <SelectItem value="5">5 - Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="font-['Poppins:Medium',sans-serif] text-[11.507px] text-[#495d72]">
                Sleep Hours *
              </Label>
              <Input
                required
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={formData.sleepHours}
                onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                className="font-['Poppins:Regular',sans-serif] text-[11.507px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-[13.151px] py-[9.863px] rounded-[3.288px] font-['Poppins:Medium',sans-serif] text-[13.151px] text-[#495d72] hover:bg-[#f4f6f7] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0c1e33] text-white px-[13.151px] py-[9.863px] rounded-[3.288px] font-['Poppins:Medium',sans-serif] text-[13.151px] hover:bg-[#1a2f4a] transition-colors"
            >
              Add Student
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
