"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card"; // importe o seu card customizado
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface ReusableCardProps {
  /** Conteúdo que será mostrado na parte superior do card */
  header: React.ReactNode;
  /** Conteúdo principal do card */
  content: React.ReactNode;
  /** Conteúdo a ser exibido no modal expandido */
  expandedContent: React.ReactNode;
  /** Largura do modal expandido (padrão: 521) */
  expandedWidth?: number;
  /** Altura do modal expandido (padrão: 220) */
  expandedHeight?: number;
}

export const ReusableCard = ({
  header,
  content,
  expandedContent,
  expandedWidth = 521,
  expandedHeight = 220,
}: ReusableCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [cardPosition, setCardPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCardClick = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
    setExpanded(true);
  };

  const handleClose = () => {
    setExpanded(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  return (
    <>
      <div ref={cardRef} onClick={handleCardClick} className="cursor-pointer">
        <Card>
          <CardContent className="p-4">
            {header}
            {content}
          </CardContent>
        </Card>
      </div>

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {expanded && (
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 cursor-pointer"
                onClick={handleBackdropClick}
              >
                <motion.div
                  ref={modalRef}
                  initial={{
                    top: cardPosition.top,
                    left: cardPosition.left,
                    width: cardPosition.width,
                    height: cardPosition.height,
                    opacity: 0,
                  }}
                  animate={{
                    top: "50%",
                    left: "50%",
                    width: expandedWidth,
                    height: expandedHeight,
                    opacity: 1,
                    translateX: "-50%",
                    translateY: "-50%",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    transition: { duration: 0.3 },
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="fixed z-50 bg-background border rounded-lg shadow-xl overflow-hidden"
                >
                  <div className="h-full p-6">
                    {expandedContent}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};
