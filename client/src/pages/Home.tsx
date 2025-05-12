import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRightIcon,
  SortAscIcon,
  SearchIcon,
  NetworkIcon,
  GitBranchIcon,
  BrainIcon
} from "lucide-react";

export function Home() {
  const [_, setLocation] = useLocation();
  
  // Fetch algorithm categories from the backend
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['/api/algorithm-categories'],
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-slate-50">
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                Visualize and Learn Algorithms
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                An interactive tool to help you understand algorithms through
                step-by-step animations, detailed explanations, and educational content.
              </p>
              <Button 
                onClick={() => setLocation("/visualizer")} 
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md text-lg"
              >
                Start Visualizing
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">Algorithm Categories</h2>
            <p className="text-slate-600 mb-12 text-center max-w-3xl mx-auto">
              Explore different types of algorithms with interactive visualizations
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <CategoryCard 
                title="Sorting Algorithms" 
                description="Visualize how arrays are arranged in a specific order" 
                icon={<SortAscIcon className="h-10 w-10 text-primary-500" />}
                link="/visualizer/1" // Bubble Sort
              />
              
              <CategoryCard 
                title="Searching Algorithms" 
                description="Discover how elements are found in data structures" 
                icon={<SearchIcon className="h-10 w-10 text-primary-500" />}
                link="/visualizer/6" // Binary Search
              />
              
              <CategoryCard 
                title="Pathfinding Algorithms" 
                description="Explore how to find the shortest path in graphs" 
                icon={<NetworkIcon className="h-10 w-10 text-primary-500" />}
                link="/visualizer/8" // Dijkstra's Algorithm
              />
              
              <CategoryCard 
                title="Graph Algorithms" 
                description="Learn how to traverse and analyze graph structures" 
                icon={<GitBranchIcon className="h-10 w-10 text-primary-500" />}
                link="/visualizer/10" // BFS
              />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="bg-white border-y border-slate-200 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">Key Features</h2>
            <p className="text-slate-600 mb-12 text-center max-w-3xl mx-auto">
              What makes our algorithm visualizer a powerful educational tool
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                title="Step-by-Step Animation" 
                description="Watch algorithms execute one step at a time with clear visual feedback" 
              />
              
              <FeatureCard 
                title="Interactive Controls" 
                description="Play, pause, step forward/backward, and adjust animation speed" 
              />
              
              <FeatureCard 
                title="Educational Explanations" 
                description="Learn with detailed explanations, pseudocode, and complexity analysis" 
              />
              
              <FeatureCard 
                title="Customizable Input" 
                description="Adjust array size and data distribution to see how algorithms behave" 
              />
              
              <FeatureCard 
                title="Performance Statistics" 
                description="Track comparisons, swaps, and array accesses to understand efficiency" 
              />
              
              <FeatureCard 
                title="Multiple Data Structures" 
                description="Visualize algorithms on arrays, graphs, trees, and more" 
              />
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-slate-100 border border-slate-200 p-10 rounded-xl shadow-sm">
                  <BrainIcon className="h-16 w-16 text-primary-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Dive Into Algorithms?</h2>
                  <p className="text-slate-600 mb-8 text-lg">
                    Start your journey to master algorithms through interactive visualizations and step-by-step learning.
                  </p>
                  <Button 
                    onClick={() => setLocation("/visualizer")} 
                    variant="default"
                    className="px-8 py-3 rounded-md text-lg font-medium"
                  >
                    Explore Visualizations
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

type CategoryCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
};

function CategoryCard({ title, description, icon, link }: CategoryCardProps) {
  const [_, setLocation] = useLocation();
  
  return (
    <Card className="border-slate-200 transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {icon}
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-slate-600 min-h-[60px]">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => setLocation(link)} 
          variant="outline" 
          className="w-full"
        >
          Explore
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
};

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

export default Home;
