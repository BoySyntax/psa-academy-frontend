import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import authBg from "@/assets/auth-bg.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRegistrationForm } from "@/hooks/useRegistrationForm";
import { registrationService } from "@/services/registration";
import { RegistrationFormData } from "@/types/registration";
import { USER_TYPE_OPTIONS } from "@/constants/userTypes";

interface AuthPageProps {
  onLoginSuccess?: (user: { id: number; firstName: string; lastName: string }) => void;
}

const AuthPage = ({ onLoginSuccess }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { formData, updateField } = useRegistrationForm();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  
  // Prevent multiple submissions
  const isSubmittingRef = useRef(false);
  const lastSubmitTimeRef = useRef(0);
  const SUBMIT_COOLDOWN = 10000; // 10 seconds between attempts

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple concurrent submissions
    if (isSubmittingRef.current || isLoading) {
      return;
    }
    
    // Prevent rapid successive submissions
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTimeRef.current;
    
    if (timeSinceLastSubmit < SUBMIT_COOLDOWN) {
      const secondsToWait = Math.ceil((SUBMIT_COOLDOWN - timeSinceLastSubmit) / 1000);
      setMessage({
        type: "error",
        text: `Please wait ${secondsToWait} seconds before trying again`,
      });
      return;
    }
    
    lastSubmitTimeRef.current = now;
    isSubmittingRef.current = true;
    setIsLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        // Login
        const result = await registrationService.loginUser(
          username,
          password
        );
        if (result.success) {
          setMessage({ type: "success", text: result.message });
          // Reset login fields
          setUsername("");
          setPassword("");
          setShowPassword(false);
          // Call the callback after a short delay to show the success message
          if (onLoginSuccess && result.user) {
            setTimeout(() => {
              onLoginSuccess(result.user);
            }, 500);
          }
        } else {
          setMessage({ type: "error", text: result.message });
        }
      } else {
        // Register - validate passwords match
        if (formData.password !== confirmPassword) {
          setMessage({ type: "error", text: "Passwords do not match" });
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setMessage({ type: "error", text: "Password must be at least 6 characters" });
          setIsLoading(false);
          return;
        }

        const result = await registrationService.registerUser(
          formData as RegistrationFormData
        );
        if (result.success) {
          setMessage({ type: "success", text: "Account created! You can now sign in." });
          // Reset form
          setConfirmPassword("");
          setShowPassword(false);
          // Switch to login tab
          setTimeout(() => setIsLogin(true), 2000);
        } else {
          setMessage({ type: "error", text: result.message });
        }
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={authBg}
          alt="Abstract art"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/30" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-light leading-relaxed text-foreground/90 max-w-md"
          >
            Where creativity
            <br />
            meets <span className="text-primary font-semibold">simplicity</span>.
          </motion.p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              ●&nbsp; PSA Academy
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            {["Sign In", "Sign Up"].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setIsLogin(i === 0)}
                className={`relative flex-1 rounded-md py-2.5 text-sm font-medium transition-colors ${
                  (i === 0 ? isLogin : !isLogin)
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-blue-600"
                }`}
              >
                {(i === 0 ? isLogin : !isLogin) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-md bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Message Display */}
              {message && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.type === "success"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {!isLogin && (
                <Accordion type="multiple" className="w-full">
                  {/* Personal Information */}
                  <AccordionItem value="personal-info">
                    <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
                      Personal Information
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.firstName}
                              onChange={(e) => updateField("firstName", e.target.value)}
                              placeholder="Enter your first name"
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              disabled={isLoading}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Middle Name
                            </label>
                            <input
                              type="text"
                              value={formData.middleName}
                              onChange={(e) => updateField("middleName", e.target.value)}
                              placeholder="Enter your middle name"
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.lastName}
                              onChange={(e) => updateField("lastName", e.target.value)}
                              placeholder="Enter your last name"
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              disabled={isLoading}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Suffix
                            </label>
                            <input
                              type="text"
                              value={formData.suffix}
                              onChange={(e) => updateField("suffix", e.target.value)}
                              placeholder="Jr., Sr., III, etc."
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={(e) => updateField("dateOfBirth", e.target.value)}
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              disabled={isLoading}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Sex <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={formData.sex}
                              onChange={(e) => updateField("sex", e.target.value)}
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              disabled={isLoading}
                            >
                              <option value="">Select sex</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Blood Type
                            </label>
                            <select
                              value={formData.bloodType}
                              onChange={(e) => updateField("bloodType", e.target.value)}
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              disabled={isLoading}
                            >
                              <option value="">Select blood type</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Civil Status <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={formData.civilStatus}
                              onChange={(e) => updateField("civilStatus", e.target.value)}
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              disabled={isLoading}
                            >
                              <option value="">Select civil status</option>
                              <option value="single">Single</option>
                              <option value="married">Married</option>
                              <option value="divorced">Divorced</option>
                              <option value="widowed">Widowed</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Type of Disability
                            </label>
                            <select
                              value={formData.typeOfDisability}
                              onChange={(e) => updateField("typeOfDisability", e.target.value)}
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              disabled={isLoading}
                            >
                              <option value="">Select type of disability</option>
                              <option value="none">None</option>
                              <option value="physical">Physical</option>
                              <option value="visual">Visual</option>
                              <option value="hearing">Hearing</option>
                              <option value="mental">Mental</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Religion
                            </label>
                            <select
                              value={formData.religion}
                              onChange={(e) => updateField("religion", e.target.value)}
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              disabled={isLoading}
                            >
                              <option value="">Select religion</option>
                              <option value="catholic">Catholic</option>
                              <option value="protestant">Protestant</option>
                              <option value="islam">Islam</option>
                              <option value="buddhism">Buddhism</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Educational Attainment <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.educationalAttainment}
                            onChange={(e) => updateField("educationalAttainment", e.target.value)}
                            className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            disabled={isLoading}
                          >
                            <option value="">Select educational attainment</option>
                            <option value="elementary">Elementary</option>
                            <option value="high-school">High School</option>
                            <option value="college">College</option>
                            <option value="masters">Master's Degree</option>
                            <option value="phd">PhD</option>
                          </select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Address */}
                  <AccordionItem value="address">
                    <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
                      Address
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            House No. and Street <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.houseNoAndStreet}
                            onChange={(e) => updateField("houseNoAndStreet", e.target.value)}
                            placeholder="Enter house number and street"
                            className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Barangay <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.barangay}
                              onChange={(e) => updateField("barangay", e.target.value)}
                              placeholder="Enter barangay"
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              disabled={isLoading}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Municipality <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.municipality}
                              onChange={(e) => updateField("municipality", e.target.value)}
                              placeholder="Enter municipality"
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Province <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.province}
                              onChange={(e) => updateField("province", e.target.value)}
                              placeholder="Enter province"
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              disabled={isLoading}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Region <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.region}
                              onChange={(e) => updateField("region", e.target.value)}
                              placeholder="Enter region"
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Contact Information */}
                  <AccordionItem value="contact-info">
                    <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
                      Contact Information
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Cellphone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={formData.cellphoneNumber}
                            onChange={(e) => updateField("cellphoneNumber", e.target.value)}
                            placeholder="0917 123 4567 or +63 917 123 4567"
                            className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            placeholder="Enter email address"
                            className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Employment Details */}
                  <AccordionItem value="employment">
                    <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
                      Employment Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Type of Employment
                            </label>
                            <select
                              value={formData.typeOfEmployment}
                              onChange={(e) => updateField("typeOfEmployment", e.target.value)}
                              disabled={isLoading}
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="">Select type of employment</option>
                              <option value="government">Government</option>
                              <option value="private">Private</option>
                              <option value="self-employed">Self-employed</option>
                              <option value="unemployed">Unemployed</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Civil Service Eligibility Level
                            </label>
                            <select
                              value={formData.civilServiceEligibilityLevel}
                              onChange={(e) => updateField("civilServiceEligibilityLevel", e.target.value)}
                              disabled={isLoading}
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="">Select civil service eligibility level</option>
                              <option value="none">None</option>
                              <option value="sub-professional">Sub-professional</option>
                              <option value="professional">Professional</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Salary Grade
                            </label>
                            <select
                              value={formData.salaryGrade}
                              onChange={(e) => updateField("salaryGrade", e.target.value)}
                              disabled={isLoading}
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="">Select salary grade</option>
                              <option value="sg1">SG-1</option>
                              <option value="sg2">SG-2</option>
                              <option value="sg3">SG-3</option>
                              <option value="sg4">SG-4</option>
                              <option value="sg5">SG-5</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Present Position
                            </label>
                            <input
                              type="text"
                              value={formData.presentPosition}
                              onChange={(e) => updateField("presentPosition", e.target.value)}
                              placeholder="Enter present position"
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Office
                            </label>
                            <input
                              type="text"
                              value={formData.office}
                              onChange={(e) => updateField("office", e.target.value)}
                              placeholder="Enter office"
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isLoading}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Service
                            </label>
                            <input
                              type="text"
                              value={formData.service}
                              onChange={(e) => updateField("service", e.target.value)}
                              placeholder="Enter service"
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Division/Province
                          </label>
                          <input
                            type="text"
                            value={formData.divisionProvince}
                            onChange={(e) => updateField("divisionProvince", e.target.value)}
                            placeholder="Enter division/province"
                            className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Emergency Contact */}
                  <AccordionItem value="emergency-contact">
                    <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
                      Emergency Contact
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Name of Contact Person
                            </label>
                            <input
                              type="text"
                              value={formData.emergencyContactName}
                              onChange={(e) => updateField("emergencyContactName", e.target.value)}
                              placeholder="Enter emergency contact name"
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isLoading}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Relationship
                            </label>
                            <input
                              type="text"
                              value={formData.emergencyContactRelationship}
                              onChange={(e) => updateField("emergencyContactRelationship", e.target.value)}
                              placeholder="Enter relationship"
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Contact Address
                          </label>
                          <input
                            type="text"
                            value={formData.emergencyContactAddress}
                            onChange={(e) => updateField("emergencyContactAddress", e.target.value)}
                            placeholder="Enter contact address"
                            className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Contact Number
                          </label>
                          <input
                            type="tel"
                            value={formData.emergencyContactNumber}
                            onChange={(e) => updateField("emergencyContactNumber", e.target.value)}
                            placeholder="Enter contact number"
                            className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Account Details */}
                  <AccordionItem value="account-details">
                    <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
                      Account Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Username <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => updateField("username", e.target.value)}
                            placeholder="Choose a username"
                            className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={(e) => updateField("password", e.target.value)}
                              placeholder="Create password"
                              className="w-full rounded-lg border border-border bg-input px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-blue-600 transition-colors"
                              disabled={isLoading}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Confirm Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            User Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.userType}
                            onChange={(e) => updateField("userType", e.target.value)}
                            className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                          >
                            {USER_TYPE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <p className="text-xs text-muted-foreground mt-1">
                            Select your role in the system
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              {isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              )}

              {isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-border bg-input px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-blue-600 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:bg-blue-600 transition-colors auth-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>{isLogin ? "Signing in..." : "Creating Account..."}</span>
                  </div>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or continue with</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary py-3 text-sm font-medium text-foreground hover:bg-blue-500/10 hover:border-blue-500/30 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary py-3 text-sm font-medium text-foreground hover:bg-blue-500/10 hover:border-blue-500/30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </motion.form>
          </AnimatePresence>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:text-blue-600 hover:underline">Terms</a> and{" "}
            <a href="#" className="text-primary hover:text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
