import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Shield, Code } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About the Project</h1>
            <p className="text-lg text-muted-foreground">
              Learn more about the Smart College Timetable Generator
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The Smart College Timetable Generator is a responsive web application designed to help 
                  students efficiently manage their weekly college schedules. Built with modern web technologies, 
                  it provides an intuitive interface for creating, viewing, and managing timetables.
                </p>
                <p className="text-muted-foreground">
                  Students can easily add subjects to specific time slots across different days of the week, 
                  view their complete schedule in a structured table format, and manage their timetable with 
                  features like save, edit, reset, and PDF download capabilities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Code className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Technical Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Frontend</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• React with TypeScript</li>
                      <li>• Tailwind CSS for styling</li>
                      <li>• shadcn/ui component library</li>
                      <li>• React Router for navigation</li>
                      <li>• Vite for build tooling</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Backend</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Supabase for database</li>
                      <li>• PostgreSQL database</li>
                      <li>• Row Level Security (RLS)</li>
                      <li>• Real-time data sync</li>
                      <li>• User authentication</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      <strong className="text-foreground">Easy Subject Management:</strong> Add subjects with 
                      specific time slots and days using simple dropdown selectors
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      <strong className="text-foreground">Structured View:</strong> View your entire week at 
                      a glance in a clean table format with rows for time slots and columns for days
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      <strong className="text-foreground">Persistent Storage:</strong> All timetable data is 
                      securely stored and persists across sessions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      <strong className="text-foreground">Edit & Reset:</strong> Modify existing entries or 
                      reset your entire timetable to start fresh
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      <strong className="text-foreground">PDF Export:</strong> Download your timetable as a 
                      PDF for offline access and printing
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      <strong className="text-foreground">Responsive Design:</strong> Works seamlessly on 
                      desktop, tablet, and mobile devices
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Each user has their own secure account with username and password authentication. 
                  Your timetable data is private and only accessible to you. The application uses 
                  Row Level Security (RLS) policies to ensure data isolation between users.
                </p>
                <p className="text-muted-foreground">
                  The first user to register automatically becomes an admin, with the ability to 
                  manage user roles through the admin panel.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-accent/50">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Built with ❤️ for students to simplify their academic scheduling
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
