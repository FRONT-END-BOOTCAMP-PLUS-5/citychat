"use client";

import SubSlider from "./components/SubSlider";
import Section from "./components/Section";

export default function Home() {
  return (
    <div
      style={{
        height: "100dvh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      {/* <Section
        bgImageUrl="https://images.unsplash.com/photo-1603883055407-968560f7522e?q=80&w=920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      >
        <Slider />
      </Section> */}

      <Section
        bgImageUrl="https://images.unsplash.com/photo-1603883055407-968560f7522e?q=80&w=920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      >
        <SubSlider />
      </Section>
    </div>
  );
}

