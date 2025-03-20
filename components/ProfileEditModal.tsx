'use client'

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2, Twitter, Instagram, Youtube, Globe, Facebook, Linkedin, Github } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";

type SocialLink = {
  platform: string;
  url: string;
};

type ProfileEditModalProps = {
  clerkId: string;
  initialName?: string;
  initialBio?: string;
  initialWebsite?: string;
  initialSocialLinks?: SocialLink[];
};

const PLATFORM_OPTIONS = [
  { value: "twitter", label: "Twitter" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "website", label: "Other" },
];

export default function ProfileEditModal({
  clerkId,
  initialName = "",
  initialBio = "",
  initialWebsite = "",
  initialSocialLinks = [],
}: ProfileEditModalProps) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [website, setWebsite] = useState(initialWebsite);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks);
  const [open, setOpen] = useState(false);

  const updateProfile = useMutation(api.users.updateUserProfile);
  const { toast } = useToast();

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "twitter", url: "" }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  const handleSubmit = async () => {
    try {
      // Filter out empty social links
      const filteredLinks = socialLinks.filter(link => link.url.trim() !== "");

      await updateProfile({
        clerkId,
        name: name.trim() !== "" ? name : undefined,
        bio: bio.trim() !== "" ? bio : undefined,
        website: website.trim() !== "" ? website : undefined,
        socialLinks: filteredLinks.length > 0 ? filteredLinks : undefined,
      });

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
        duration: 3000,
      });

      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2.5 bg-black-1/50 hover:bg-black-1/70 text-white-1 flex items-center px-6 py-2.5 rounded-full border border-gray-800 transition-all duration-200 shadow-sm"
        >
          <Pencil size={16} className="text-orange-1" />
          <span className="font-medium">Edit Profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black-1 border-gray-800 text-white-1 max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white-1">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white-2">Name</Label>
            <Input
              id="name"
              placeholder="Your display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                // Prevent default behavior for space key to ensure it's captured
                if (e.key === ' ') {
                  e.stopPropagation();
                }
              }}
              className="bg-black-2 border-gray-800 text-white-1 focus:ring-orange-1 focus:border-orange-1"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white-2">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell others about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              onKeyDown={(e) => {
                // Prevent default behavior for space key to ensure it's captured
                if (e.key === ' ') {
                  e.stopPropagation();
                }
              }}
              className="bg-black-2 border-gray-800 text-white-1 focus:ring-orange-1 focus:border-orange-1"
              maxLength={250}
            />
            <p className="text-xs text-white-3 text-right">{bio.length}/250</p>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-white-2">Website</Label>
            <Input
              id="website"
              placeholder="https://yourwebsite.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="bg-black-2 border-gray-800 text-white-1 focus:ring-orange-1 focus:border-orange-1"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-white-2">Social Links</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSocialLink}
                className="h-8 gap-1 border-white-1/20 text-white-1 hover:bg-white-1/10"
                disabled={socialLinks.length >= 5}
              >
                <Plus size={14} />
                Add
              </Button>
            </div>

            {socialLinks.length === 0 ? (
              <p className="text-sm text-white-3 italic">No social links added yet.</p>
            ) : (
              <div className="space-y-3">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <select
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(index, "platform", e.target.value)}
                      className="bg-black-2 border border-gray-800 rounded-md text-white-1 focus:ring-orange-1 focus:border-orange-1 text-sm h-10 w-1/3"
                    >
                      {PLATFORM_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      placeholder={`Your ${PLATFORM_OPTIONS.find(p => p.value === link.platform)?.label} URL`}
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, "url", e.target.value)}
                      className="bg-black-2 border-gray-800 text-white-1 focus:ring-orange-1 focus:border-orange-1 flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSocialLink(index)}
                      className="h-10 w-10 text-white-3 hover:text-red-500 hover:bg-white-1/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {socialLinks.length >= 5 && (
              <p className="text-xs text-white-3">Maximum of 5 social links allowed.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-white-2 hover:bg-white-1/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-orange-1 hover:bg-orange-1/90 text-black"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}