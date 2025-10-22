"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HappyUsers from "./happy-users";
import HeroBg from "./bg";
import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/icon";
import { Link } from "@/i18n/routing";
import ZoomableImage from "@/components/ui/zoomable-image";
import PdfPreviewDialog from "@/components/ui/pdf-preview-dialog";
import OcrDemoDialog from "@/components/ui/ocr-demo-dialog";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Hero({ hero }: { hero: HeroType }) {
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState("");
  const [ocrDemoOpen, setOcrDemoOpen] = useState(false);
  const [ocrDemoUrl, setOcrDemoUrl] = useState("");
  const t = useTranslations("pdf_dialog");

  if (hero.disabled) {
    return null;
  }

  const highlightText = hero.highlight_text;
  let texts = null;
  if (highlightText) {
    texts = hero.title?.split(highlightText, 2);
  }

  const handlePdfPreviewClick = (url: string) => {
    setSelectedPdfUrl(url);
    setPdfDialogOpen(true);
  };

  const handleOcrDemoClick = (url: string) => {
    setOcrDemoUrl(url);
    setOcrDemoOpen(true);
  };

  return (
    <>
      <HeroBg />
      <section className="py-24">
        <div className="container">
          {hero.show_badge && (
            <div className="flex items-center justify-center mb-8">
              <img
                src="/imgs/badges/phdaily.svg"
                alt="phdaily"
                className="h-10 object-cover"
              />
            </div>
          )}
          <div className="text-center">
            {hero.announcement && (
              <Link
                href={hero.announcement.url as any}
                className="mx-auto mb-3 inline-flex items-center gap-3 rounded-full border px-2 py-1 text-sm"
              >
                {hero.announcement.label && (
                  <Badge>{hero.announcement.label}</Badge>
                )}
                {hero.announcement.title}
              </Link>
            )}

            {texts && texts.length > 1 ? (
              <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
                {texts[0]}
                <span className="bg-linear-to-r from-primary via-primary to-primary bg-clip-text text-transparent">
                  {highlightText}
                </span>
                {texts[1]}
              </h1>
            ) : (
              <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
                {hero.title}
              </h1>
            )}

            <p
              className="m mx-auto max-w-3xl text-muted-foreground lg:text-xl"
              dangerouslySetInnerHTML={{ __html: hero.description || "" }}
            />
            {hero.buttons && (
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                {hero.buttons.map((item, i) => {
                  // 如果是 PDF 预览按钮
                  if (item.isPdfPreview && item.url) {
                    return (
                      <Button
                        key={i}
                        className="w-full sm:w-auto"
                        size="lg"
                        variant={item.variant || "default"}
                        onClick={() => handlePdfPreviewClick(item.url!)}
                      >
                        {item.icon && <Icon name={item.icon} className="" />}
                        {item.title}
                      </Button>
                    );
                  }

                  // 如果是 OCR Demo 按钮
                  if (item.isOcrDemo && item.url) {
                    return (
                      <Button
                        key={i}
                        className="w-full sm:w-auto"
                        size="lg"
                        variant={item.variant || "default"}
                        onClick={() => handleOcrDemoClick(item.url!)}
                      >
                        {item.icon && <Icon name={item.icon} className="" />}
                        {item.title}
                      </Button>
                    );
                  }

                  // 普通按钮
                  return (
                    <Link
                      key={i}
                      href={item.url as any}
                      target={item.target || ""}
                      className="flex items-center"
                    >
                      <Button
                        className="w-full"
                        size="lg"
                        variant={item.variant || "default"}
                      >
                        {item.icon && <Icon name={item.icon} className="" />}
                        {item.title}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}
            {hero.tip && (
              <p className="mt-8 text-md text-muted-foreground">{hero.tip}</p>
            )}
            {hero.show_happy_users && <HappyUsers />}

            {/* Hero Image Section */}
            <div className="mt-12 flex justify-center">
              <ZoomableImage
                src="/imgs/hero.png"
                alt="Hero"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PDF 预览 Dialog */}
      <PdfPreviewDialog
        open={pdfDialogOpen}
        onOpenChange={setPdfDialogOpen}
        pdfUrl={selectedPdfUrl}
        title={t("title")}
        description={t("description")}
      />

      {/* OCR Demo Dialog */}
      <OcrDemoDialog
        open={ocrDemoOpen}
        onOpenChange={setOcrDemoOpen}
        demoUrl={ocrDemoUrl}
      />
    </>
  );
}
