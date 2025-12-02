import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Student } from "../data/mockStudents";
import { BookOpen, Calendar, TrendingUp, User } from "lucide-react";

interface StudentDetailsProps {
  student: Student;
}

export function StudentDetails({ student }: StudentDetailsProps) {
  const attendancePercentage = (student.attendance.present / student.attendance.totalClasses) * 100;

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-500";
    if (grade.startsWith("B")) return "bg-blue-500";
    if (grade.startsWith("C")) return "bg-yellow-500";
    if (grade.startsWith("D")) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Tabs defaultValue="courses" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="courses">
          <BookOpen className="h-4 w-4 mr-2" />
          Courses
        </TabsTrigger>
        <TabsTrigger value="performance">
          <TrendingUp className="h-4 w-4 mr-2" />
          Performance
        </TabsTrigger>
        <TabsTrigger value="attendance">
          <Calendar className="h-4 w-4 mr-2" />
          Attendance
        </TabsTrigger>
        <TabsTrigger value="personal">
          <User className="h-4 w-4 mr-2" />
          Personal Info
        </TabsTrigger>
      </TabsList>

      <TabsContent value="courses" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Courses</CardTitle>
            <CardDescription>Fall 2024 Semester</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {student.courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>
                      <Badge className={getGradeColor(course.grade)}>
                        {course.grade}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 pt-4 border-t">
              <p className="text-muted-foreground">
                Total Credits: {student.courses.reduce((sum, course) => sum + course.credits, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>GPA by Semester</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {student.performance.map((semester, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{semester.semester}</span>
                      <span>{semester.gpa.toFixed(2)}</span>
                    </div>
                    <Progress value={(semester.gpa / 4) * 100} />
                    <p className="text-muted-foreground">Credits: {semester.credits}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
              <CardDescription>Overall academic performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Cumulative GPA</span>
                  <span>{student.gpa.toFixed(2)}</span>
                </div>
                <Progress value={(student.gpa / 4) * 100} />
              </div>
              
              <div>
                <p className="text-muted-foreground mb-2">Total Credits Earned</p>
                <p>
                  {student.performance.reduce((sum, sem) => sum + sem.credits, 0)} credits
                </p>
              </div>

              <div>
                <p className="text-muted-foreground mb-2">Average Semester GPA</p>
                <p>
                  {(student.performance.reduce((sum, sem) => sum + sem.gpa, 0) / student.performance.length).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground mb-2">Academic Standing</p>
                <Badge className={student.gpa >= 3.5 ? "bg-green-500" : student.gpa >= 3.0 ? "bg-blue-500" : "bg-yellow-500"}>
                  {student.gpa >= 3.5 ? "Dean's List" : student.gpa >= 3.0 ? "Good Standing" : "Satisfactory"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="attendance" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>Current semester attendance record</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Attendance Rate</span>
                  <span>{attendancePercentage.toFixed(1)}%</span>
                </div>
                <Progress value={attendancePercentage} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Present</p>
                  <p className="text-green-600">{student.attendance.present}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Absent</p>
                  <p className="text-red-600">{student.attendance.absent}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Late</p>
                  <p className="text-yellow-600">{student.attendance.late}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Total Classes</p>
                  <p>{student.attendance.totalClasses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Status</CardTitle>
              <CardDescription>Performance assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground mb-2">Status</p>
                <Badge className={attendancePercentage >= 90 ? "bg-green-500" : attendancePercentage >= 75 ? "bg-yellow-500" : "bg-red-500"}>
                  {attendancePercentage >= 90 ? "Excellent" : attendancePercentage >= 75 ? "Good" : "Needs Improvement"}
                </Badge>
              </div>

              <div className="space-y-2">
                <p>
                  {attendancePercentage >= 90
                    ? "Outstanding attendance record. Keep up the excellent work!"
                    : attendancePercentage >= 75
                    ? "Good attendance. Try to improve further for better academic outcomes."
                    : "Attendance is below recommended levels. Please consult with your advisor."}
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-muted-foreground">
                  Classes remaining: {student.attendance.totalClasses - student.attendance.present - student.attendance.absent - student.attendance.late}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="personal" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Student contact and demographic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground">Date of Birth</p>
                <p>{new Date(student.dateOfBirth).toLocaleDateString()}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Email Address</p>
                <p>{student.email}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Phone Number</p>
                <p>{student.phone}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Address</p>
                <p>{student.address}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Enrollment Date</p>
                <p>{new Date(student.enrollmentDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>In case of emergency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground">Contact Name</p>
                <p>{student.emergencyContact.name}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Relationship</p>
                <p>{student.emergencyContact.relationship}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Phone Number</p>
                <p>{student.emergencyContact.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
