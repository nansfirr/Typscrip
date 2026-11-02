// import { Link} from "@tanstack/react-router";
// import { Component } from "react";



// class ErrorBoundary extends Component{
//     state = {hasError: false};
//     static getDerivedStateFromError(){
//         return {hasError: true};
//     }

//     componentDidCatch(error, info){
//         console.error("Error Boundary menangkap error", error, info);
//     }
import { Link } from "@tanstack/react-router";
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

class ErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, info);
  }
    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h2>Waduh!</h2>
                    <p>
                        Telah terjadi error pada list ini <Link to={"/"}>Click disini</Link>{" "}
                        untuk kembali ke beranda
                    </p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;