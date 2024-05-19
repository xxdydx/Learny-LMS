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
    createdAt: string;
  }

  const AnnouncementCard = ({
    title,
    message,
    expiryDate,
    createdAt,
  }: AnnouncementCardProps) => (
    <ThemeProvider theme={theme}>
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography
            component="div"
            style={{ fontWeight: "600", fontSize: "1.8rem" }}
          >
            {title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} variant="body2" color="text.secondary">
            Created at: {new Date(createdAt).toLocaleDateString()}, Expires on:{" "}
            {new Date(expiryDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">{message}</Typography>
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

                  {course?.announcements && course?.announcements.length > 0 ? (
                    course.announcements.map((announcement) => (
                      <Container>
                        <AnnouncementCard
                          key={announcement.id}
                          title={announcement.title}
                          message={announcement.message}
                          createdAt={announcement.createdAt}
                          expiryDate={announcement.expiry}
                        />
                      </Container>
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      No announcements found.
                    </Typography>
                  )}
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
