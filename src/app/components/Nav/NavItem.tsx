"use client";

import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

type SubNavItem = {
  title: string;
  links: string[];
}

type NavItemProps = {
  title: string;
  subNavItems: SubNavItem[];
}

export function NavItem(props: NavItemProps) {
  const { title, subNavItems } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [positionReady, setPositionReady] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPopupPosition({
          top: rect.bottom + window.scrollY,
          left: 0
        });
        setPositionReady(true);
      }
    };

    if (isHovered) {
      setPositionReady(false);
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    } else {
      setPositionReady(false);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isHovered]);

  return (
    <>
      <div 
        ref={triggerRef}
        className={clsx(
          "h-full flex items-center text-sky-500 cursor-pointer font-medium text-sm border-b-2 transition-all duration-100 px-2",
          isHovered ? "border-[#0090e3]" : "border-transparent"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {title}
      </div>
      {isHovered && positionReady && createPortal(
        <div 
          className="fixed z-50 w-screen bg-white shadow-lg"
          style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="mx-auto max-w-[1400px] grid grid-cols-6 gap-8 p-8 text-sm">
            {subNavItems.map((subNavItem, index) => (
              <div key={index}>
                <div className="mb-2 font-bold text-[#0090e3]">
                  {subNavItem.title}
                </div>
                {subNavItem.links.map((link, linkIndex) => (
                  <a key={linkIndex} href="#" className="block text-black hover:underline">
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}