"use client";

import { ToastContainer } from "react-toastify";
// No need to import ReactToastify.css in v11+ if you fully customize

export default function Toaster() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3500}
      hideProgressBar={false}        // keep thin progress bar with accent
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      // theme="colored"             // we override everything anyway
      limit={3}                      // prevent too many stacking
      className="pointer-events-auto pt-4 md:pt-6" // space below header
      toastClassName={`
        !flex !items-start !gap-3
        !rounded-xl !border !shadow-lg
        !bg-white/85 dark:!bg-black/80
        !border-black/10 dark:!border-white/10
        !backdrop-blur-md
        !p-4 !text-sm !font-medium !tracking-tight
        !text-black dark:!text-white
        !min-w-[340px] !max-w-[420px] sm:!max-w-[500px]
        !transition-all !duration-300
        !shadow-black/5 dark:!shadow-black/40
      `}
      // Progress bar uses your accent color
      progressClassName={`
        !h-0.5 !bg-[#968e68]/70
        !rounded-t-xl
      `}
      // Body padding & alignment
      bodyClassName="!p-0 !flex !items-center !gap-3"
      // Optional: hide default icon if you want ultra-clean look
      // icon={false}
      // Or keep type-based icons (recommended for clarity)
    />
  );
}