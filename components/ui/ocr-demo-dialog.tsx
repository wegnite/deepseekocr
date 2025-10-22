"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface OcrDemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demoUrl: string;
  title?: string;
  description?: string;
}

export default function OcrDemoDialog({
  open,
  onOpenChange,
  demoUrl,
  title,
  description,
}: OcrDemoDialogProps) {
  const t = useTranslations("ocr_demo");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // 使用翻译或默认值
  const dialogTitle = title || t("title");
  const dialogDescription = description || t("description");

  useEffect(() => {
    // 检测移动端
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);

      // 移动端直接打开新标签页，不打开 Dialog
      if (mobile && open) {
        window.open(demoUrl, "_blank");
        onOpenChange(false);
      }
    };

    checkMobile();
  }, [open, demoUrl, onOpenChange]);

  // 重置加载状态
  useEffect(() => {
    if (open) {
      setLoading(true);
    }
  }, [open]);

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleFullscreen = () => {
    const element = dialogRef.current;
    if (!element) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      element.requestFullscreen().catch((err) => {
        console.error("无法进入全屏模式:", err);
      });
    }
  };

  // 移动端不渲染 Dialog
  if (isMobile) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={dialogRef}
        className={cn(
          "max-w-[98vw] h-[98vh] flex flex-col p-0",
          // 全屏时的样式覆盖
          isFullscreen && "!max-w-full !h-full !w-full !translate-x-0 !translate-y-0 !left-0 !top-0"
        )}
      >
        {/* Header 区域 */}
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="RiFlashlightLine" className="h-5 w-5" />
              {dialogTitle}
            </DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
        </div>

        {/* OCR Demo 内容区域 */}
        <div className="flex-1 relative mx-6 mt-4 mb-4 border rounded-lg overflow-hidden bg-muted">
          {/* 加载状态 */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">{t("loading")}</p>
              </div>
            </div>
          )}

          {/* 懒加载 iframe - 仅在 Dialog 打开时加载 */}
          {open && (
            <iframe
              src={demoUrl}
              className="w-full h-full"
              title={dialogTitle}
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
          )}
        </div>

        {/* 底部操作按钮 */}
        <div className="flex justify-between items-center gap-3 px-6 pb-6">
          {/* 左侧：全屏按钮 */}
          <Button
            variant="outline"
            onClick={handleFullscreen}
            title={isFullscreen ? t("exit_fullscreen") : t("fullscreen")}
          >
            <Icon
              name={isFullscreen ? "RiFullscreenExitLine" : "RiFullscreenLine"}
              className="mr-2"
            />
            {isFullscreen ? t("exit_fullscreen") : t("fullscreen")}
          </Button>

          {/* 右侧：关闭按钮 */}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <Icon name="RiCloseLine" className="mr-2" />
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
