import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { getCookie } from "@/lib/functions/storage.lib";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { Theme, alpha } from "@mui/material/styles";
import { destroyCookie } from "nookies";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createClient } from "utils/supabase/client";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
interface AccountPopoverProps {
  // You can define any additional props here
}

const MENU_OPTIONS = [
  {
    label: "Home",
    icon: "eva:home-fill"
  },
  {
    label: "Profile",
    icon: "eva:person-fill"
  },
  {
    label: "Settings",
    icon: "eva:settings-2-fill"
  }
];

const AccountPopover: React.FC<AccountPopoverProps> = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userData } = useAppSelector((s) => s.userSlice);
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    destroyCookie(null, "adminToken", { path: "/auth/login" });
    deleteCookie("adminToken");
    router.push("/auth/login");
  };

  const [email, setEmail] = useState('')
  useEffect(()=>{
    const emailId = getCookie("userData");
    setEmail(emailId as string)
  }, [email])
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme: Theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme: Theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
          })
        }}
      >
        <Avatar
          src=""
          alt="test"
          sx={{
            width: 36,
            height: 36,
            border: (theme: Theme) =>
              `solid 2px ${theme.palette.background.default}`
          }}
        >
          {email.charAt(0).replace("@gmail.com", '').toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200
          }
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {email?.replace("@gmail.com", "")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: "dashed", m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleClose}
          sx={{ typography: "body2", color: "error.main", py: 1.5 }}
        >
          <Button onClick={handleLogout}> Logout </Button>
        </MenuItem>
      </Popover>
    </>
  );
};

export default AccountPopover;
