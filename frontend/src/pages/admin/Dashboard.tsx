import { useEffect, useState } from "react";
import {
  Newspaper,
  FileCheck,
  Users,
  BadgeCheck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Calendar,
  Circle,
  LucideIcon,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================
interface Statistics {
  totalBerita: number;
  totalSkema: number;
  totalAsesor: number;
  totalUser: number;
}

interface Trends {
  totalBerita: number;
  totalSkema: number;
  totalAsesor: number;
  totalUser: number;
}

interface Visitors {
  month: number;
  week: number;
  today: number;
}

type NewsStatus = "Publish" | "Draft";

interface NewsItem {
  id: number;
  title: string;
  date: string;
  status: NewsStatus;
}

interface DashboardData {
  statistics: Statistics;
  trends: Trends;
  visitors: Visitors;
  latestNews: NewsItem[];
}

interface StatCard {
  key: keyof Statistics;
  title: string;
  value: number;
  trend: number;
  icon: LucideIcon;
  accent: string;
  iconBg: string;
  bar: string;
}

const INITIAL_DASHBOARD_DATA: DashboardData = {
  statistics: {
    totalBerita: 0,
    totalSkema: 0,
    totalAsesor: 0,
    totalUser: 0,
  },
  trends: {
    totalBerita: 0,
    totalSkema: 0,
    totalAsesor: 0,
    totalUser: 0,
  },
  visitors: {
    month: 0,
    week: 0,
    today: 0,
  },
  latestNews: [],
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(
    INITIAL_DASHBOARD_DATA,
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async (): Promise<void> => {
    try {
      // ===========================================
      // NANTI GANTI DENGAN API
      // ===========================================

      // const response = await axios.get(
      //   "http://localhost:8000/api/dashboard"
      // );

      // setDashboardData(response.data);

      const dummyResponse: DashboardData = {
        statistics: {
          totalBerita: 24,
          totalSkema: 12,
          totalAsesor: 18,
          totalUser: 8,
        },

        trends: {
          totalBerita: 12,
          totalSkema: -4,
          totalAsesor: 8,
          totalUser: 20,
        },

        visitors: {
          month: 4520,
          week: 1230,
          today: 215,
        },

        latestNews: [
          {
            id: 1,
            title: "Pembukaan Sertifikasi Digital Marketing 2026",
            date: "10 Juli 2026",
            status: "Publish",
          },
          {
            id: 2,
            title: "Pelatihan Asesor Kompetensi",
            date: "8 Juli 2026",
            status: "Publish",
          },
          {
            id: 3,
            title: "Skema Baru Multimedia",
            date: "5 Juli 2026",
            status: "Draft",
          },
        ],
      };

      setTimeout(() => {
        setDashboardData(dummyResponse);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const cards: StatCard[] = [
    {
      key: "totalBerita",
      title: "Total Berita",
      value: dashboardData.statistics.totalBerita,
      trend: dashboardData.trends.totalBerita,
      icon: Newspaper,
      accent: "text-blue-600",
      iconBg: "bg-blue-50",
      bar: "bg-blue-500",
    },
    {
      key: "totalSkema",
      title: "Skema Sertifikasi",
      value: dashboardData.statistics.totalSkema,
      trend: dashboardData.trends.totalSkema,
      icon: FileCheck,
      accent: "text-emerald-600",
      iconBg: "bg-emerald-50",
      bar: "bg-emerald-500",
    },
    {
      key: "totalAsesor",
      title: "Asesor",
      value: dashboardData.statistics.totalAsesor,
      trend: dashboardData.trends.totalAsesor,
      icon: BadgeCheck,
      accent: "text-violet-600",
      iconBg: "bg-violet-50",
      bar: "bg-violet-500",
    },
    {
      key: "totalUser",
      title: "Pengguna",
      value: dashboardData.statistics.totalUser,
      trend: dashboardData.trends.totalUser,
      icon: Users,
      accent: "text-amber-600",
      iconBg: "bg-amber-50",
      bar: "bg-amber-500",
    },
  ];

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 11
      ? "Selamat pagi"
      : hour < 15
        ? "Selamat siang"
        : hour < 19
          ? "Selamat sore"
          : "Selamat malam";

  const visitorMax = Math.max(
    dashboardData.visitors.month,
    dashboardData.visitors.week,
    dashboardData.visitors.today,
    1,
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 p-8 2xl:p-12">
      {/* Header */}
      <div className="mb-10 flex flex-col justify-between gap-3 border-b border-slate-200 pb-7 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 2xl:text-4xl">
            {greeting}, Admin
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Selamat datang di panel administrasi LSP Multi Bintang Komunikasi.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar size={16} className="text-slate-400" />
          <span className="capitalize">{today}</span>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((item) => {
              const Icon = item.icon;
              const isPositive = item.trend >= 0;

              return (
                <div
                  key={item.key}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 ${item.bar}`} />

                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {item.title}
                      </p>
                      <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                        {item.value.toLocaleString("id-ID")}
                      </h2>
                    </div>

                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.accent} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon size={26} strokeWidth={2} />
                    </div>
                  </div>

                  <div
                    className={`mt-4 flex items-center gap-1 text-xs font-semibold ${
                      isPositive ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    {isPositive ? "+" : ""}
                    {item.trend}%
                    <span className="font-normal text-slate-400">
                      dari bulan lalu
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Section */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Visitor */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7">
              <div className="mb-7 flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <TrendingUp size={20} />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Statistik Kunjungan
                </h2>
              </div>

              <ProgressBar
                title="Pengunjung Bulan Ini"
                value={dashboardData.visitors.month}
                widthPercent={(dashboardData.visitors.month / visitorMax) * 100}
                color="bg-blue-600"
              />

              <ProgressBar
                title="Pengunjung Minggu Ini"
                value={dashboardData.visitors.week}
                widthPercent={(dashboardData.visitors.week / visitorMax) * 100}
                color="bg-indigo-500"
              />

              <ProgressBar
                title="Pengunjung Hari Ini"
                value={dashboardData.visitors.today}
                widthPercent={(dashboardData.visitors.today / visitorMax) * 100}
                color="bg-sky-500"
                isLast
              />
            </div>

            {/* Latest News */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 xl:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <Newspaper size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Berita Terbaru
                  </h2>
                </div>

                <button className="group flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700">
                  Lihat Semua
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
              </div>

              {dashboardData.latestNews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-slate-400">
                  <Newspaper size={28} className="mb-2 opacity-40" />
                  <p className="text-sm">Belum ada berita.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {dashboardData.latestNews.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 py-4 transition hover:bg-slate-50/60"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.date}
                        </p>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                          item.status === "Publish"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-amber-50 text-amber-700 ring-amber-200"
                        }`}
                      >
                        <Circle
                          size={6}
                          className={
                            item.status === "Publish"
                              ? "fill-emerald-500 text-emerald-500"
                              : "fill-amber-500 text-amber-500"
                          }
                        />
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// PROGRESS BAR
// ============================================================
interface ProgressBarProps {
  title: string;
  value: number;
  widthPercent: number;
  color: string;
  isLast?: boolean;
}

function ProgressBar({
  title,
  value,
  widthPercent,
  color,
  isLast = false,
}: ProgressBarProps) {
  const clampedWidth = Math.min(100, Math.max(0, widthPercent));

  return (
    <div className={isLast ? "" : "mb-6"}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-slate-500">{title}</span>
        <span className="text-sm font-semibold text-slate-800">
          {value.toLocaleString("id-ID")}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${clampedWidth}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================
// SKELETON LOADING
// ============================================================
function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-7"
          >
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="h-3.5 w-24 rounded bg-slate-200" />
                <div className="mt-4 h-8 w-16 rounded bg-slate-200" />
              </div>
              <div className="h-14 w-14 shrink-0 rounded-xl bg-slate-200" />
            </div>
            <div className="mt-4 h-3 w-28 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-7">
          <div className="mb-7 flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-lg bg-slate-200" />
            <div className="h-4 w-36 rounded bg-slate-200" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-6 last:mb-0">
              <div className="mb-2 flex items-center justify-between">
                <div className="h-3 w-32 rounded bg-slate-200" />
                <div className="h-3 w-10 rounded bg-slate-200" />
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100" />
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 xl:col-span-2">
          <div className="mb-6 flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-lg bg-slate-200" />
            <div className="h-4 w-32 rounded bg-slate-200" />
          </div>
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="h-3.5 w-3/4 rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-20 rounded bg-slate-200" />
                </div>
                <div className="h-5 w-16 shrink-0 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
