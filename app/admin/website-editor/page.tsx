"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Globe,
  BarChart3,
  MessageSquare,
  Info,
  Image,
  Save,
  Loader2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Plus,
  Trash2,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface StatsItem {
  number: string;
  suffix: string;
  label: string;
  description: string;
}

const TABS = [
  { id: "general", label: "General", icon: Settings },
  { id: "hero", label: "Hero Section", icon: Globe },
  { id: "stats", label: "Statistics", icon: BarChart3 },
  { id: "cta", label: "CTA Section", icon: MessageSquare },
  { id: "about", label: "About Page", icon: Info },
  { id: "footer", label: "Footer & Contact", icon: MessageSquare },
  { id: "media", label: "Media", icon: Image },
] as const;

type TabId = (typeof TABS)[number]["id"];

function InputField({
  label,
  settingKey,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  settingKey: string;
  type?: string;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(settingKey, e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
      />
    </div>
  );
}

function TextareaField({
  label,
  settingKey,
  rows = 3,
  helpText,
  value,
  onChange,
}: {
  label: string;
  settingKey: string;
  rows?: number;
  helpText?: string;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(settingKey, e.target.value)}
        rows={rows}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 resize-vertical"
      />
      {helpText && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

function CommaArrayField({
  label,
  settingKey,
  helpText,
  value,
  onChange,
}: {
  label: string;
  settingKey: string;
  helpText?: string;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(settingKey, e.target.value)}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 resize-vertical"
      />
      <p className="mt-1 text-xs text-gray-500">
        {helpText || "Comma-separated list. Converts to JSON array on save."}
      </p>
    </div>
  );
}

function SaveButton({
  onClick,
  sectionName,
  saving,
}: {
  onClick: () => void;
  sectionName: string;
  saving: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
    >
      {saving ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      {saving ? "Saving..." : "Save"}
    </button>
  );
}

export default function WebsiteEditorPage() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [uploading, setUploading] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSettings(data.settings || {});
    } catch {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async (keys: string[], sectionName: string) => {
    setSavingSection(sectionName);
    setError("");
    setSuccess("");
    try {
      const payload: Record<string, any> = {};
      for (const key of keys) {
        payload[key] = settings[key] ?? "";
      }
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSuccess(`${sectionName} saved successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError(`Failed to save ${sectionName}`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setSavingSection(null);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are accepted");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("File must be under 2MB");
      return;
    }
    setUploading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/media", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const logoPath = data.path || data.url || data.filePath;
      updateSetting("logo_url", logoPath);
      // Also persist to settings
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo_url: logoPath }),
      });
      setSuccess("Logo uploaded and saved!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  // Parse comma-separated string to JSON array
  const commaToArray = (val: string): string[] => {
    if (!val) return [];
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  // Parse JSON array or comma string for display
  const arrayToComma = (val: any): string => {
    if (!val) return "";
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.join(", ");
      } catch {
        return val;
      }
      return val;
    }
    if (Array.isArray(val)) return val.join(", ");
    return String(val);
  };

  const getStatsItems = (): StatsItem[] => {
    const raw = settings.stats_items;
    if (!raw) {
      return Array.from({ length: 4 }, () => ({
        number: "",
        suffix: "",
        label: "",
        description: "",
      }));
    }
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (Array.isArray(parsed)) {
        while (parsed.length < 4)
          parsed.push({ number: "", suffix: "", label: "", description: "" });
        return parsed.slice(0, 4);
      }
    } catch {}
    return Array.from({ length: 4 }, () => ({
      number: "",
      suffix: "",
      label: "",
      description: "",
    }));
  };

  const updateStatsItem = (
    index: number,
    field: keyof StatsItem,
    value: string
  ) => {
    const items = getStatsItems();
    items[index] = { ...items[index], [field]: value };
    updateSetting("stats_items", JSON.stringify(items));
  };

  // Save handlers per section
  const saveGeneral = () =>
    saveSettings(
      ["site_title", "site_description", "logo_url", "navbar_cta_text"],
      "General"
    );

  const saveHero = () => {
    // Convert hero_features comma list to JSON array before saving
    const features = commaToArray(
      arrayToComma(settings.hero_features)
    );
    updateSetting("hero_features", JSON.stringify(features));
    const keys = ["hero_title", "hero_subtitle", "hero_badge", "hero_features"];
    const payload: Record<string, any> = {};
    for (const key of keys) {
      if (key === "hero_features") {
        payload[key] = JSON.stringify(features);
      } else {
        payload[key] = settings[key] ?? "";
      }
    }
    setSavingSection("Hero Section");
    setError("");
    setSuccess("");
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setSuccess("Hero Section saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      })
      .catch(() => {
        setError("Failed to save Hero Section");
        setTimeout(() => setError(""), 5000);
      })
      .finally(() => setSavingSection(null));
  };

  const saveStats = () => {
    const items = getStatsItems();
    const payload: Record<string, any> = {
      stats_title: settings.stats_title ?? "",
      stats_subtitle: settings.stats_subtitle ?? "",
      stats_items: JSON.stringify(items),
    };
    setSavingSection("Statistics");
    setError("");
    setSuccess("");
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setSuccess("Statistics saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      })
      .catch(() => {
        setError("Failed to save Statistics");
        setTimeout(() => setError(""), 5000);
      })
      .finally(() => setSavingSection(null));
  };

  const saveCta = () =>
    saveSettings(["cta_badge", "cta_title", "cta_subtitle"], "CTA Section");

  const saveAbout = () => {
    const features = commaToArray(arrayToComma(settings.about_features));
    const payload: Record<string, any> = {
      about_title: settings.about_title ?? "",
      about_subtitle: settings.about_subtitle ?? "",
      about_why_title: settings.about_why_title ?? "",
      about_why_text: settings.about_why_text ?? "",
      about_features: JSON.stringify(features),
    };
    setSavingSection("About Page");
    setError("");
    setSuccess("");
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setSuccess("About Page saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      })
      .catch(() => {
        setError("Failed to save About Page");
        setTimeout(() => setError(""), 5000);
      })
      .finally(() => setSavingSection(null));
  };

  const saveFooter = () =>
    saveSettings(
      [
        "footer_text",
        "contact_email",
        "contact_phone",
        "contact_address",
        "contact_working_hours",
        "social_github",
        "social_twitter",
        "social_linkedin",
        "social_instagram",
      ],
      "Footer & Contact"
    );


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Website Editor</h1>
        <p className="text-gray-500 mt-1">
          Edit all frontend text content and media across your website.
        </p>
      </div>

      {/* Status messages */}
      {success && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Tab navigation */}
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-1 -mb-px" aria-label="Tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* General */}
        {activeTab === "general" && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              General Settings
            </h2>
            <InputField label="Site Title" settingKey="site_title" value={settings.site_title ?? ""} onChange={updateSetting} />
            <TextareaField label="Site Description" settingKey="site_description" value={settings.site_description ?? ""} onChange={updateSetting} />
            <ImageUpload
              value={settings.logo_url ?? ""}
              onChange={(url) => updateSetting("logo_url", url)}
              label="Logo"
              recommendedSize="400 x 100 px (rasio 4:1, transparan PNG)"
              maxSizeMB={1}
              accept="image/png,image/svg+xml,image/webp"
            />
            <InputField label="Navbar CTA Text" settingKey="navbar_cta_text" value={settings.navbar_cta_text ?? ""} onChange={updateSetting} />
            <div className="pt-4 border-t border-gray-100">
              <SaveButton onClick={saveGeneral} sectionName="General" saving={savingSection === "General"} />
            </div>
          </div>
        )}

        {/* Hero */}
        {activeTab === "hero" && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Hero Section
            </h2>
            <InputField label="Hero Title" settingKey="hero_title" value={settings.hero_title ?? ""} onChange={updateSetting} />
            <TextareaField label="Hero Subtitle" settingKey="hero_subtitle" value={settings.hero_subtitle ?? ""} onChange={updateSetting} />
            <InputField label="Hero Badge" settingKey="hero_badge" value={settings.hero_badge ?? ""} onChange={updateSetting} />
            <CommaArrayField
              label="Hero Features"
              settingKey="hero_features"
              helpText="Enter features separated by commas. They will be saved as a JSON array."
              value={arrayToComma(settings.hero_features)}
              onChange={updateSetting}
            />
            <div className="pt-4 border-t border-gray-100">
              <SaveButton onClick={saveHero} sectionName="Hero Section" saving={savingSection === "Hero Section"} />
            </div>
          </div>
        )}

        {/* Statistics */}
        {activeTab === "stats" && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Statistics Section
            </h2>
            <InputField label="Section Title" settingKey="stats_title" value={settings.stats_title ?? ""} onChange={updateSetting} />
            <TextareaField label="Section Subtitle" settingKey="stats_subtitle" value={settings.stats_subtitle ?? ""} onChange={updateSetting} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Statistics Items
              </label>
              <div className="space-y-4">
                {getStatsItems().map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <p className="text-sm font-medium text-gray-600 mb-3">
                      Item {idx + 1}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Number
                        </label>
                        <input
                          type="text"
                          value={item.number}
                          onChange={(e) =>
                            updateStatsItem(idx, "number", e.target.value)
                          }
                          placeholder="e.g. 100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Suffix
                        </label>
                        <input
                          type="text"
                          value={item.suffix}
                          onChange={(e) =>
                            updateStatsItem(idx, "suffix", e.target.value)
                          }
                          placeholder="e.g. + or %"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) =>
                            updateStatsItem(idx, "label", e.target.value)
                          }
                          placeholder="e.g. Happy Clients"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateStatsItem(idx, "description", e.target.value)
                          }
                          placeholder="Short description"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <SaveButton onClick={saveStats} sectionName="Statistics" saving={savingSection === "Statistics"} />
            </div>
          </div>
        )}

        {/* CTA */}
        {activeTab === "cta" && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              CTA Section
            </h2>
            <InputField label="CTA Badge" settingKey="cta_badge" value={settings.cta_badge ?? ""} onChange={updateSetting} />
            <InputField label="CTA Title" settingKey="cta_title" value={settings.cta_title ?? ""} onChange={updateSetting} />
            <TextareaField label="CTA Subtitle" settingKey="cta_subtitle" value={settings.cta_subtitle ?? ""} onChange={updateSetting} />
            <div className="pt-4 border-t border-gray-100">
              <SaveButton onClick={saveCta} sectionName="CTA Section" saving={savingSection === "CTA Section"} />
            </div>
          </div>
        )}

        {/* About */}
        {activeTab === "about" && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              About Page
            </h2>
            <InputField label="About Title" settingKey="about_title" value={settings.about_title ?? ""} onChange={updateSetting} />
            <TextareaField label="About Subtitle" settingKey="about_subtitle" value={settings.about_subtitle ?? ""} onChange={updateSetting} />
            <InputField label="Why Choose Us Title" settingKey="about_why_title" value={settings.about_why_title ?? ""} onChange={updateSetting} />
            <TextareaField
              label="Why Choose Us Text"
              settingKey="about_why_text"
              rows={4}
              value={settings.about_why_text ?? ""}
              onChange={updateSetting}
            />
            <CommaArrayField
              label="About Features"
              settingKey="about_features"
              helpText="Enter features separated by commas. They will be saved as a JSON array."
              value={arrayToComma(settings.about_features)}
              onChange={updateSetting}
            />
            <div className="pt-4 border-t border-gray-100">
              <SaveButton onClick={saveAbout} sectionName="About Page" saving={savingSection === "About Page"} />
            </div>
          </div>
        )}

        {/* Footer & Contact */}
        {activeTab === "footer" && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Footer & Contact
            </h2>
            <TextareaField label="Footer Text" settingKey="footer_text" rows={2} value={settings.footer_text ?? ""} onChange={updateSetting} />

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Contact Information
              </h3>
              <div className="space-y-4">
                <InputField label="Email" settingKey="contact_email" type="email" value={settings.contact_email ?? ""} onChange={updateSetting} />
                <InputField label="Phone" settingKey="contact_phone" value={settings.contact_phone ?? ""} onChange={updateSetting} />
                <InputField label="Address" settingKey="contact_address" value={settings.contact_address ?? ""} onChange={updateSetting} />
                <InputField
                  label="Working Hours"
                  settingKey="contact_working_hours"
                  value={settings.contact_working_hours ?? ""}
                  onChange={updateSetting}
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Social Media Links
              </h3>
              <div className="space-y-4">
                <InputField label="GitHub" settingKey="social_github" value={settings.social_github ?? ""} onChange={updateSetting} />
                <InputField label="Twitter / X" settingKey="social_twitter" value={settings.social_twitter ?? ""} onChange={updateSetting} />
                <InputField label="LinkedIn" settingKey="social_linkedin" value={settings.social_linkedin ?? ""} onChange={updateSetting} />
                <InputField label="Instagram" settingKey="social_instagram" value={settings.social_instagram ?? ""} onChange={updateSetting} />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <SaveButton onClick={saveFooter} sectionName="Footer & Contact" saving={savingSection === "Footer & Contact"} />
            </div>
          </div>
        )}

        {/* Media */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Media & Branding
            </h2>

            <ImageUpload
              value={settings.logo_url ?? ""}
              onChange={async (url) => {
                updateSetting("logo_url", url);
                if (url) {
                  await fetch("/api/settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ logo_url: url }),
                  });
                  setSuccess("Logo uploaded and saved!");
                  setTimeout(() => setSuccess(""), 3000);
                }
              }}
              label="Site Logo"
              recommendedSize="400 x 100 px (rasio 4:1, transparan PNG)"
              maxSizeMB={1}
              accept="image/png,image/svg+xml,image/webp"
            />

            <ImageUpload
              value={settings.favicon_url ?? ""}
              onChange={async (url) => {
                updateSetting("favicon_url", url);
                if (url) {
                  await fetch("/api/settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ favicon_url: url }),
                  });
                  setSuccess("Favicon uploaded and saved!");
                  setTimeout(() => setSuccess(""), 3000);
                }
              }}
              label="Favicon"
              recommendedSize="32 x 32 px atau 64 x 64 px (1:1 square)"
              maxSizeMB={0.5}
              accept="image/png,image/x-icon,image/svg+xml"
            />

            <ImageUpload
              value={settings.og_image_url ?? ""}
              onChange={async (url) => {
                updateSetting("og_image_url", url);
                if (url) {
                  await fetch("/api/settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ og_image_url: url }),
                  });
                  setSuccess("OG Image uploaded and saved!");
                  setTimeout(() => setSuccess(""), 3000);
                }
              }}
              label="OG Image (Social Media Preview)"
              recommendedSize="1200 x 630 px (rasio 1.91:1)"
              maxSizeMB={2}
            />
          </div>
        )}
      </div>
    </div>
  );
}
