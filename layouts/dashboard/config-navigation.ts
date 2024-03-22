import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import TocIcon from "@mui/icons-material/Toc";
import BugReportIcon from "@mui/icons-material/BugReport";

export interface NavItem {
  title: string;
  path: string | null;
  icon: React.ElementType | null; // Use React.ElementType to represent the type of the icon
  children: NavItem[];
  hasChild: boolean;
}

const navConfig: NavItem[] = [
  {
    title: "dashboard",
    path: "/dashboard",
    icon: DashboardIcon,
    children: [],
    hasChild: false
  },
  {
    title: "cms",
    path: "/dashboard/cms/home",
    icon: TocIcon,
    children: [
      {
        title: "Home",
        path: "/dashboard/cms/home",
        icon: SettingsIcon,
        children: [],
        hasChild: true
      },
      {
        title: "About",
        path: "/dashboard/cms/home",
        icon: SettingsIcon,
        children: [],
        hasChild: true
      },
      {
        title: "Privacy Policy",
        path: "/dashboard/cms/home",
        icon: SettingsIcon,
        children: [],
        hasChild: true
      }
    ],
    hasChild: true
  },
  {
    title: "user",
    path: "/dashboard/user",
    icon: PersonIcon,
    children: [],
    hasChild: false
  },
  {
    title: "Issue",
    path: "/issue",
    icon: BugReportIcon,
    children: [],
    hasChild: false
  }
];

export default navConfig;
