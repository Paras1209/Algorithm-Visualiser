import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Visualizer from "@/pages/Visualizer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/visualizer" component={Visualizer} />
      <Route path="/visualizer/:algorithmId" component={Visualizer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
