"use client";

import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import ZoomableImage from "@/components/ui/zoomable-image";
import { Button } from "@/components/ui/button";
import OcrDemoDialog from "@/components/ui/ocr-demo-dialog";
import { useState } from "react";

export default function Experience({ section }: { section: SectionType }) {
  const [ocrDemoOpen, setOcrDemoOpen] = useState(false);
  const [ocrDemoUrl, setOcrDemoUrl] = useState("");

  if (section.disabled) {
    return null;
  }

  const handleOcrDemoClick = (url: string) => {
    setOcrDemoUrl(url);
    setOcrDemoOpen(true);
  };

  return (
    <>
      <section id={section.name} className="py-16">
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-12">
            {section.label && (
              <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4">
                {section.label}
              </span>
            )}
            {section.title && (
              <h2 className="mb-4 text-pretty text-3xl font-bold lg:text-4xl">
                {section.title}
              </h2>
            )}
            {section.description && (
              <p className="mx-auto max-w-2xl text-muted-foreground lg:text-lg">
                {section.description}
              </p>
            )}
          </div>

          {/* Experience Content */}
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Preview Image */}
            {section.image?.src && (
              <div className="order-2 lg:order-1">
                <ZoomableImage
                  src={section.image.src}
                  alt="DeepSeek OCR Demo Preview"
                  className="max-h-full w-full rounded-lg border shadow-lg object-cover"
                />
              </div>
            )}

            {/* CTA Area */}
            <div className="flex flex-col justify-center order-1 lg:order-2">
              {section.buttons && section.buttons.length > 0 && (
                <div className="flex flex-col gap-4">
                  {section.buttons.map((button, i) => {
                    // OCR Demo 按钮
                    if (button.isOcrDemo && button.url) {
                      return (
                        <Button
                          key={i}
                          size="lg"
                          variant={button.variant || "default"}
                          className="w-full sm:w-auto text-lg py-6"
                          onClick={() => handleOcrDemoClick(button.url!)}
                        >
                          {button.icon && <Icon name={button.icon} className="mr-2" />}
                          {button.title}
                        </Button>
                      );
                    }

                    // 普通链接按钮
                    if (button.url) {
                      return (
                        <a
                          key={i}
                          href={button.url}
                          target={button.target || "_self"}
                          rel={button.target === "_blank" ? "noopener noreferrer" : undefined}
                        >
                          <Button
                            size="lg"
                            variant={button.variant || "default"}
                            className="w-full sm:w-auto text-lg py-6"
                          >
                            {button.icon && <Icon name={button.icon} className="mr-2" />}
                            {button.title}
                          </Button>
                        </a>
                      );
                    }

                    return null;
                  })}
                  <p className="text-sm text-muted-foreground mt-2">
                    ✨ 无需注册，立即体验 · 支持桌面端和移动端
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* OCR Demo Dialog */}
      <OcrDemoDialog
        open={ocrDemoOpen}
        onOpenChange={setOcrDemoOpen}
        demoUrl={ocrDemoUrl}
      />
    </>
  );
}
