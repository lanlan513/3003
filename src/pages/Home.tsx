import { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/layout/HeroSection';
import Footer from '@/components/layout/Footer';
import HistorySection from '@/components/sections/HistorySection';
import TimelineSection from '@/components/sections/TimelineSection';
import TradeSection from '@/components/sections/TradeSection';
import RegionsSection from '@/components/sections/RegionsSection';
import ShapesSection from '@/components/sections/ShapesSection';
import CraftsSection from '@/components/sections/CraftsSection';
import PotteryGameSection from '@/components/sections/PotteryGameSection';
import RestorationSection from '@/components/sections/RestorationSection';
import DetailModal from '@/components/common/DetailModal';
import type { DetailData } from '@/types';

export default function Home() {
  const [detailData, setDetailData] = useState<DetailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetail = useCallback((data: DetailData) => {
    setDetailData(data);
    setIsModalOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-porcelain-paper text-porcelain-inkbrown">
      <Navbar />

      <main>
        <HeroSection />

        <HistorySection onOpenDetail={handleOpenDetail} />

        <TimelineSection onOpenDetail={handleOpenDetail} />

        <TradeSection onOpenDetail={handleOpenDetail} />

        <RegionsSection onOpenDetail={handleOpenDetail} />

        <ShapesSection onOpenDetail={handleOpenDetail} />

        <CraftsSection onOpenDetail={handleOpenDetail} />

        <PotteryGameSection onOpenDetail={handleOpenDetail} />

        <RestorationSection onOpenDetail={handleOpenDetail} />
      </main>

      <Footer />

      <DetailModal
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
        data={detailData}
        onOpenDetail={handleOpenDetail}
      />
    </div>
  );
}
