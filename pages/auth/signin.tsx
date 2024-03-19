import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import { useState } from "react";

import Logo from "@/components/logo/logo";
import validationText from "@/json/messages/validationText";
import { emailRegex } from "@/lib/regex";
import { bgGradient } from "@/themes/css";
import CustomInput from "@/ui/Inputs/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "utils/supabase/client";
// ----------------------------------------------------------------------

const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email(validationText.error.email_format)
    .required(validationText.error.enter_email)
    .matches(emailRegex, validationText.error.email_format),

  password: yup.string().trim().required(validationText.error.enter_password)
});

export default function LoginView() {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function login(formData: FormData) {
    const supabase = createClient();
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: "/assets/background/overlay_4.jpg"
        }),
        height: "100vh"
      }}
    >
      <Logo
        sx={{
          position: "fixed",
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 }
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420
          }}
        >
          <Typography variant="h4">Sign in</Typography>

          <Divider sx={{ my: 3 }} />

          <Box component="form" onSubmit={() => login}>
            <Stack spacing={3}>
              <CustomInput
                placeholder="Enter email"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <CustomInput
                placeholder="Enter Password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <RemoveRedEyeIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              >
                Login
              </LoadingButton>
            </Stack>
          </Box>
        </Card>
      </Stack>
    </Box>
  );
}
