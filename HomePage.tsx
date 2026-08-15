import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Eye, Clock, UserCog, Wand2, CheckCircle2 } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';

export default function HomePage() {
  const features = [
    {
      icon: Calendar,
      title: 'Create Timetable',
      description: 'Manually add subjects with teachers, sections, and time slots to build your schedule',
      link: '/create',
      color: 'text-blue-500',
    },
    {
      icon: Wand2,
      title: 'Auto-Generate',
      description: 'Automatically generate optimized timetables with intelligent conflict detection',
      link: '/auto-generate',
      color: 'text-purple-500',
    },
    {
      icon: Eye,
      title: 'View Timetable',
      description: 'View your complete weekly schedule and download it as PDF for offline access',
      link: '/view',
      color: 'text-green-500',
    },
    {
      icon: Clock,
      title: 'Custom Time Slots',
      description: 'Configure your own time slots to match your institution\'s schedule',
      link: '/settings',
      color: 'text-orange-500',
    },
  ];

  const benefits = [
    {
      icon: Wand2,
      title: 'Automated Scheduling',
      description: 'Use intelligent algorithms to generate timetables automatically instead of manual scheduling',
    },
    {
      icon: CheckCircle2,
      title: 'Conflict Detection',
      description: 'Avoid teacher clashes, classroom overlaps, and subject timing issues automatically',
    },
    {
      icon: Clock,
      title: 'Time Saving',
      description: 'Reduce hours of manual work to just minutes with automated generation',
    },
    {
      icon: UserCog,
      title: 'Resource Optimization',
      description: 'Optimize classroom, faculty availability, and lab timings efficiently',
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tighter glitch" data-text="Smart College Timetable Generator">
            <span className="gradient-text drop-shadow-[0_0_15px_rgba(0,191,255,0.5)]">
              Smart College Timetable Generator
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Automate timetable creation for colleges using intelligent algorithms. Avoid conflicts, optimize resources, and save time with our AI-powered scheduling platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link to="/auto-generate">
                <Wand2 className="mr-2 h-5 w-5" />
                Auto-Generate Timetable
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link to="/create">
                <Calendar className="mr-2 h-5 w-5" />
                Create Manually
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="w-full">
                    <Link to={feature.link}>Get Started →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Why Use Our Platform?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our intelligent timetable generator is designed to solve the complex scheduling challenges faced by educational institutions
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <benefit.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <CardTitle className="text-lg mb-2">{benefit.title}</CardTitle>
                      <CardDescription>{benefit.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Add Your Resources</h3>
                <p className="text-muted-foreground">
                  Input subjects, faculty names, classrooms, and configure your time slots
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Set Your Constraints</h3>
                <p className="text-muted-foreground">
                  Choose sections, subjects per day, and enable conflict detection options
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Generate Instantly</h3>
                <p className="text-muted-foreground">
                  Click generate and let our AI create an optimized, conflict-free timetable in seconds
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">View & Download</h3>
                <p className="text-muted-foreground">
                  Review your timetable by section and download as PDF for distribution
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join institutions using smart automation to create perfect timetables
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link to="/auto-generate">
              <Wand2 className="mr-2 h-5 w-5" />
              Start Generating Now
            </Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}
