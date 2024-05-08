"use client";

import { useAppSelector } from "@/hooks";
import NotifComponent from "@/components/NotifComponent";
import { createTheme, ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const inter = Inter({ subsets: ["latin"] });

export default function AnnouncementsPage({ courseId }: { courseId: number }) {
  const courses = useAppSelector((state) => state.courses);
  const course = courses.find((course) => course.id === courseId);
  const theme = createTheme({
    typography: {
      fontFamily: inter.style.fontFamily,
    },

    palette: {
      mode: "dark",
      primary: {
        main: "#fec006",
      },
    },
  });

  interface AnnouncementCardProps {
    title: string;
    message: string;
    expiryDate: string;
  }

  const AnnouncementCard = ({
    title,
    message,
    expiryDate,
  }: AnnouncementCardProps) => (
    <ThemeProvider theme={theme}>
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Expires on: {expiryDate}
          </Typography>
          <Typography variant="body2">{message}</Typography>
        </CardContent>
      </Card>
    </ThemeProvider>
  );

  return (
    <ThemeProvider theme={theme}>
      <div className="dark">
        <div className="dark:bg-bg">
          <main className="pt-6 pb-16 lg:pt-6 lg:pb-24 bg-white dark:bg-bg">
            <div className="flex-grow">
              <div className="bg-white dark:bg-bg min-h-screen">
                <div className="w-full lg:max-w-6xl pt-4">
                  <h1 className="text-4xl tracking-tight font-semibold text-gray-900 dark:text-white mb-8">
                    Announcements
                  </h1>
                  <Container>
                    {course?.announcements &&
                      course.announcements.map((announcement) => (
                        <AnnouncementCard
                          key={announcement.id}
                          title={announcement.title}
                          message={announcement.message}
                          expiryDate={announcement.expiry}
                        />
                      ))}
                  </Container>
                </div>
              </div>
            </div>
            <NotifComponent />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
