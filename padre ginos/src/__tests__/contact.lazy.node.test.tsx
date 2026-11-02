
import { render, fireEvent } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Route } from "../routes/contact.lazy";

const queryClient = new QueryClient();

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();
const ContactRoute = Route.options.component;
if (!ContactRoute) {
  throw new Error("contact route has no component");

}
test("can submit contact form", async () => {
  fetchMocker.mockResponseOnce(
    JSON.stringify({ status: "ok" })
  );

  const screen = render(
    <QueryClientProvider client={queryClient}>
      <ContactRoute />
    </QueryClientProvider>
  );

  const nameInput = screen.getByPlaceholderText("Name") as HTMLInputElement;
  const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;
  const msgTextArea = screen.getByPlaceholderText("Message") as HTMLTextAreaElement;

  const testData = {
    name: "Nansfir",
    email: "test@example.com",
    message: "This is a test message",
  };

  fireEvent.change(nameInput, {
    target: { value: testData.name },
  });

  fireEvent.change(emailInput, {
    target: { value: testData.email },
  });

  fireEvent.change(msgTextArea, {
    target: { value: testData.message },
  });

  const btn = screen.getByRole("button");

  fireEvent.click(btn);

  const h3 = await screen.findByRole("heading", {
    level: 3,
  });

  expect(h3.textContent).toContain("Sent!");

  const requests = fetchMocker.requests();

  expect(requests.length).toBe(1);
  expect(requests[0].url).toBe("/api/contact");

  expect(fetchMocker).toHaveBeenCalledWith("/api/contact", {
    body: JSON.stringify(testData),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
});
