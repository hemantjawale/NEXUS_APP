import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/cart-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
