"use client";

import { HoverBorderButton } from "@/components/ui/hover-button";
import {
  IconArrowLeft,
  IconAt,
  IconBellRinging,
  IconCheck,
  IconSend,
  IconUserCircle,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Field from "./field";
import StateButton from "./state-button";

const ContactForm = () => {
  const [current, setCurrent] = useState("name");
  const [status, setStatus] = useState("idle");
  const [notification, setNotification] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (status === "success") {
      setShowSuccessModal(true);
      const timer = setTimeout(() => {
        setStatus("idle");
        setCurrent("name");
        setForm({ name: "", email: "", message: "" });
        setNotification("");
        setShowSuccessModal(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (name: string, value: string) => {
    if (notification) setNotification("");

    // Check if the input is empty
    if (value.trim().length === 0) {
      setForm({ ...form, [name]: "" });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (current === "name") {
      if (form.name.length === 0) {
        setNotification("Your Name, please!");
        return;
      }
      setCurrent("email");
    } else if (current === "email") {
      if (form.email.length === 0) {
        setNotification("I need your email to reply!");
        return;
      }
      setCurrent("message");
    } else {
      if (form.message.length === 0) {
        setNotification("Message missing! Let's chat.");
        return;
      }
      setStatus("submitting");

      try {
        const apiUrl =
          process.env.NODE_ENV === "production"
            ? "https://arif-sir-blog-backend.onrender.com/api/contact"
            : "http://localhost:8000/api/contact";

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            message: form.message,
          }),
        });

        if (response.ok) {
          setStatus("success");
          setNotification("Great! I've got your message.");
        } else {
          setStatus("error");
          setNotification("Something went wrong! Please try again.");
        }
      } catch (error: unknown) {
        setStatus("error");
        setNotification("Something went wrong! Please try again.");
      }
    }
  };

  return (
    <div className="w-full">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border-border mx-4 w-full max-w-md rounded-xl border p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="bg-primary/20 text-primary flex h-16 w-16 items-center justify-center rounded-full">
                <IconCheck size={32} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-fg mb-2 text-xl font-semibold">
                Message Sent Successfully!
              </h3>
              <p className="text-text-secondary mb-6 text-sm">
                Thank you for reaching out! I&apos;ll get back to you shortly.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-primary hover:bg-primary-dark text-bg w-full rounded-lg px-4 py-2 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2 overflow-hidden sm:min-h-[80px]">
        {form.name && (
          <StateButton handleClick={() => setCurrent("name")}>
            <div className="text-primary flex h-7 w-7 items-center justify-center rounded-md">
              <IconUserCircle />
            </div>
            <p className="text-xs md:text-sm">{form.name}</p>
          </StateButton>
        )}
        {form.email && (
          <StateButton handleClick={() => setCurrent("email")}>
            <div className="text-primary flex h-7 w-7 items-center justify-center rounded-md">
              <IconAt />
            </div>
            <p className="text-xs md:text-sm">{form.email}</p>
          </StateButton>
        )}
        {notification && (
          <StateButton handleClick={() => setNotification("")}>
            <div className="text-primary flex h-7 w-7 items-center justify-center rounded-md">
              <IconBellRinging />
            </div>
            <p className="text-xs md:text-sm">{notification}</p>
          </StateButton>
        )}
      </div>
      <form onSubmit={handleSubmit} className="w-full">
        {current === "name" && (
          <Field
            name="name"
            value={form.name}
            handleChange={handleChange}
            placeholder="Let me know your name"
            icon={IconUserCircle}
          />
        )}
        {current === "email" && (
          <Field
            name="email"
            value={form.email}
            handleChange={handleChange}
            placeholder="Your email address"
            icon={IconAt}
          />
        )}
        {current === "message" && (
          <Field
            name="message"
            value={form.message}
            handleChange={handleChange}
            placeholder="Write your message here..."
            icon={IconSend}
          />
        )}
        <div className="mt-10 flex justify-end">
          <HoverBorderButton type="submit">
            <div className="text-fg flex w-full cursor-pointer items-center justify-center gap-2 px-2 py-0 text-lg">
              <span
                className={`text-xl font-semibold uppercase ${
                  status === "submitting" ? "animate-pulse" : ""
                }`}
              >
                {current !== "message"
                  ? "Next"
                  : status === "submitting"
                    ? "Sending..."
                    : "Send"}
              </span>
              <div className="h-8 w-8 translate-y-1">
                {current !== "message" ? (
                  <IconArrowLeft className="rotate-180" />
                ) : (
                  <IconSend />
                )}
              </div>
            </div>
          </HoverBorderButton>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
