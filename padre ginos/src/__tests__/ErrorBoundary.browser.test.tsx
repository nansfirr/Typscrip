
import { afterEach, expect, test, vi } from "vitest";
import {
  render,
  screen,
  cleanup,
} from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import ErrorBoundary from "../ErrorBoundary";
import type { ReactElement } from "react";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderWithRouter(component: ReactElement) {
  const rootRoute = createRootRoute();

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <div>Halaman Beranda</div>,
  });

  const testRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/test",
    component: () => component,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, testRoute]),
    history: createMemoryHistory({
      initialEntries: ["/test"],
    }),
  });

  return render(<RouterProvider router={router} />);
}

test("renders children when there is no error", async () => {
  renderWithRouter(
    <ErrorBoundary>
      <p>Konten normal</p>
    </ErrorBoundary>
  );

  expect(await screen.findByText("Konten normal")).toBeTruthy();
});

test("renders fallback UI when a child component throws an error", async () => {
  const consoleError = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  function BrokenComponent(): never {
    throw new Error("Test error");
  }

  renderWithRouter(
    <ErrorBoundary>
      <BrokenComponent />
    </ErrorBoundary>
  );

  expect(await screen.findByText("Waduh!")).toBeTruthy();

  expect(
    screen.getByText(/Telah terjadi error pada list ini/)
  ).toBeTruthy();

  expect(
    screen.getByRole("link", { name: "Click disini" })
  ).toBeTruthy();

  expect(consoleError).toHaveBeenCalled();
});
