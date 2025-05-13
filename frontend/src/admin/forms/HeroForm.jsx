// frontend/src/admin/forms/HeroForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiImage,
  FiVideo,
  FiMonitor,
  FiSmartphone,
  FiInfo,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "../../services/api";

const HeroForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: "Hero Section",
    type: "hero",
    // Common content properties for both devices
    content: {
      title: "EXPLORE",
      subtitle: "",
      description: "",
      buttonText: "SHOP NOW",
      buttonLink: "/shop",
      alignment: "center",
    },
    // Desktop-specific media
    desktopMedia: {
      imageUrl: "",
      videoUrl: "",
      altText: "Hero Background",
      overlayOpacity: 0.3,
    },
    // Mobile-specific media
    mobileMedia: {
      imageUrl: "",
      videoUrl: "",
      altText: "Hero Background Mobile",
      overlayOpacity: 0.4,
    },
    isActive: true,
    order: 0,
  });

  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaTarget, setMediaTarget] = useState("desktopImage"); // What we're selecting media for
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activePreview, setActivePreview] = useState("desktop"); // For preview toggle

  // Load hero data if editing
  useEffect(() => {
    const loadData = async () => {
      if (isEditing) {
        try {
          setLoading(true);
          const response = await api.get(`/cms/sections/${id}`);

          if (response.data.success) {
            // Load desktop hero
            const heroData = response.data.data;

            // Try to find a mobile hero counterpart
            const mobileHeroResponse = await api.get(
              "/cms/sections?type=hero&deviceType=mobile"
            );
            const mobileHeroes = mobileHeroResponse.data.data || [];
            const relatedMobileHero = mobileHeroes.find(
              (h) =>
                h.content?.buttonLink === heroData.content?.buttonLink ||
                h.content?.title === heroData.content?.title
            );

            // Initialize the form with both desktop and mobile data
            setFormData({
              name: heroData.name,
              type: "hero",
              content: {
                title: heroData.content?.title || "EXPLORE",
                subtitle: heroData.content?.subtitle || "",
                description: heroData.content?.description || "",
                buttonText: heroData.content?.buttonText || "SHOP NOW",
                buttonLink: heroData.content?.buttonLink || "/shop",
                alignment: heroData.content?.alignment || "center",
              },
              // Desktop media data
              desktopMedia: {
                imageUrl: heroData.media?.imageUrl || "",
                videoUrl: heroData.media?.videoUrl || "",
                altText: heroData.media?.altText || "Hero Background",
                overlayOpacity:
                  heroData.media?.overlayOpacity !== undefined
                    ? heroData.media.overlayOpacity
                    : 0.3,
              },
              // Mobile media data (from related mobile hero or empty)
              mobileMedia: {
                imageUrl: relatedMobileHero?.media?.imageUrl || "",
                videoUrl: relatedMobileHero?.media?.videoUrl || "",
                altText:
                  relatedMobileHero?.media?.altText || "Hero Background Mobile",
                overlayOpacity:
                  relatedMobileHero?.media?.overlayOpacity !== undefined
                    ? relatedMobileHero.media.overlayOpacity
                    : 0.4,
              },
              isActive: heroData.isActive,
              order: heroData.order || 0,
              // Store IDs for updating
              desktopId: heroData._id,
              mobileId: relatedMobileHero?._id,
            });
          } else {
            setError("Failed to load hero data");
          }
        } catch (err) {
          console.error("Error loading hero section:", err);
          setError("Failed to load hero data");
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [id, isEditing]);

  // Load media library
  useEffect(() => {
    const loadMedia = async () => {
      try {
        const response = await api.get("/cms/media");
        if (response.data.success) {
          // Sort media by creation date (newest first)
          const sortedMedia = response.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setMediaLibrary(sortedMedia || []);
        }
      } catch (err) {
        console.error("Failed to load media:", err);
      }
    };

    loadMedia();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      // Handle nested fields (e.g., content.title, desktopMedia.imageUrl)
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      // Handle top-level fields
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }

    // Clear any previous error/success messages
    setError("");
    setSuccess("");
  };

  // Show media library for a specific target
  const openMediaLibrary = (target) => {
    setMediaTarget(target);
    setShowMediaLibrary(true);
  };

  // Handle media selection
  const handleMediaSelect = (mediaItem) => {
    // Determine which field to update based on the target
    if (mediaTarget === "desktopImage") {
      setFormData({
        ...formData,
        desktopMedia: {
          ...formData.desktopMedia,
          imageUrl: mediaItem.url,
          altText:
            formData.desktopMedia.altText ||
            mediaItem.altText ||
            mediaItem.name,
        },
      });
    } else if (mediaTarget === "mobileImage") {
      setFormData({
        ...formData,
        mobileMedia: {
          ...formData.mobileMedia,
          imageUrl: mediaItem.url,
          altText:
            formData.mobileMedia.altText || mediaItem.altText || mediaItem.name,
        },
      });
    }

    setShowMediaLibrary(false);
  };

  // Handle form submission - creates or updates both desktop and mobile versions
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim()) {
      setError("Section name is required");
      return;
    }

    if (!formData.desktopMedia.imageUrl && !formData.desktopMedia.videoUrl) {
      setError("Desktop hero requires either an image or video");
      return;
    }

    if (!formData.mobileMedia.imageUrl && !formData.mobileMedia.videoUrl) {
      setError("Mobile hero requires either an image or video");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Prepare desktop hero data
      const desktopHeroData = {
        name: formData.name,
        type: "hero",
        deviceType: "desktop",
        content: formData.content,
        media: formData.desktopMedia,
        isActive: formData.isActive,
        order: formData.order,
      };

      // Prepare mobile hero data
      const mobileHeroData = {
        name: `${formData.name} (Mobile)`,
        type: "hero",
        deviceType: "mobile",
        content: formData.content,
        media: formData.mobileMedia,
        isActive: formData.isActive,
        order: formData.order,
      };

      // Create/update both heroes
      if (isEditing) {
        // Update desktop hero
        await api.put(`/cms/sections/${formData.desktopId}`, desktopHeroData);

        // Update or create mobile hero
        if (formData.mobileId) {
          await api.put(`/cms/sections/${formData.mobileId}`, mobileHeroData);
        } else {
          await api.post("/cms/sections", mobileHeroData);
        }
      } else {
        // Create both desktop and mobile heroes
        const desktopResponse = await api.post(
          "/cms/sections",
          desktopHeroData
        );
        await api.post("/cms/sections", mobileHeroData);

        // Add to homepage layout
        try {
          const layoutResponse = await api.get("/cms/homepage");
          const layout = layoutResponse.data.data;

          // Only add desktop hero to layout (mobile is shown automatically)
          if (layout._id && desktopResponse.data.data._id) {
            const updatedSections = [
              ...layout.sections,
              {
                sectionId: desktopResponse.data.data._id,
                order: layout.sections.length,
                column: 0,
                width: 12,
              },
            ];

            await api.put(`/cms/layouts/${layout._id}`, {
              ...layout,
              sections: updatedSections,
            });
          }
        } catch (layoutErr) {
          console.error("Failed to update homepage layout:", layoutErr);
          // Continue anyway
        }
      }

      setSuccess("Hero section saved successfully!");
      toast.success("Hero section saved!");

      // Redirect after short delay
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      console.error("Error saving hero section:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Media library modal
  const renderMediaLibrary = () => {
    if (!showMediaLibrary) return null;

    // Filter to relevant media types
    const isVideo = mediaTarget.includes("Video");
    const relevantMedia = mediaLibrary.filter((media) =>
      isVideo
        ? media.type === "video" ||
          media.url?.toLowerCase().match(/\.(mp4|webm|mov)$/)
        : media.type === "image" ||
          media.url?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-md p-6 w-full max-w-5xl max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {isVideo ? "Select Video" : "Select Image"} for{" "}
              {mediaTarget.includes("desktop") ? "Desktop" : "Mobile"} Hero
            </h3>
            <button
              onClick={() => setShowMediaLibrary(false)}
              className="text-gray-500 hover:text-black"
            >
              &times;
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 flex items-center">
              <FiInfo className="mr-2" />
              {mediaTarget.includes("mobile")
                ? "Select a portrait (vertical) image for the best mobile experience"
                : "Select a landscape (horizontal) image for the best desktop experience"}
            </p>
          </div>

          <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relevantMedia.length > 0 ? (
              relevantMedia.map((media) => (
                <div
                  key={media._id}
                  className="border border-gray-200 p-2 cursor-pointer hover:border-black"
                  onClick={() => handleMediaSelect(media)}
                >
                  <div className="h-40 bg-gray-100 flex items-center justify-center mb-2">
                    {isVideo ? (
                      <div className="text-center">
                        <FiVideo className="mx-auto text-3xl mb-2" />
                        <p className="text-xs text-gray-500">{media.name}</p>
                      </div>
                    ) : (
                      <img
                        src={media.url}
                        alt={media.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                  </div>
                  <p className="text-xs truncate">{media.name}</p>
                </div>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-500 py-8">
                No {isVideo ? "videos" : "images"} found. Please upload some
                first.
              </p>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/media/new")}
              className="text-black hover:underline text-sm flex items-center"
            >
              <FiPlus className="mr-1" /> Upload new{" "}
              {isVideo ? "video" : "image"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="mr-2 text-gray-500 hover:text-black"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-medium">
          {isEditing ? "Edit Hero Section" : "Create Hero Section"}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between">
                <h2 className="text-lg font-medium">Hero Content</h2>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Active
                  </label>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                These settings apply to both desktop and mobile versions
              </p>
            </div>

            <div className="grid grid-cols-1  md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Internal name for this section (not displayed on website)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Order in which this hero appears (lower numbers first)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1  md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Title
                </label>
                <input
                  type="text"
                  name="content.title"
                  value={formData.content.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Main title displayed on the hero (e.g., "EXPLORE")
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  name="content.subtitle"
                  value={formData.content.subtitle}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1  md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  name="content.buttonText"
                  value={formData.content.buttonText}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Link
                </label>
                <input
                  type="text"
                  name="content.buttonLink"
                  value={formData.content.buttonLink}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., /shop"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Alignment
              </label>
              <select
                name="content.alignment"
                value={formData.content.alignment}
                onChange={handleChange}
                className="w-full  md:w-1/3 p-2 border border-gray-300 rounded-md"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Media Section */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="mb-6 flex items-center">
              <FiMonitor className="mr-2 text-xl" />
              <h2 className="text-lg font-medium">Desktop Hero Media</h2>
            </div>

            <div className="grid grid-cols-1  md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Image
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="desktopMedia.imageUrl"
                    value={formData.desktopMedia.imageUrl}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-l-md"
                    placeholder="Image URL"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaLibrary("desktopImage")}
                    className="bg-gray-200 px-4 flex items-center rounded-r-md"
                  >
                    <FiImage />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Use a landscape (horizontal) image for desktop
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Video URL (Optional)
                </label>
                <input
                  type="text"
                  name="desktopMedia.videoUrl"
                  value={formData.desktopMedia.videoUrl}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com/video.mp4"
                />
                <p className="mt-1 text-xs text-gray-500">
                  MP4 video URL - will take precedence over the image if
                  provided
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1  md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  name="desktopMedia.altText"
                  value={formData.desktopMedia.altText}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Descriptive text for the image"
                />
                <p className="mt-1 text-xs text-gray-500">
                  For accessibility and SEO
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overlay Opacity: {formData.desktopMedia.overlayOpacity}
                </label>
                <input
                  type="range"
                  name="desktopMedia.overlayOpacity"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.desktopMedia.overlayOpacity}
                  onChange={handleChange}
                  className="w-full"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Controls the darkness of the overlay on the background (0 =
                  transparent, 1 = opaque)
                </p>
              </div>
            </div>

            {/* Desktop Preview */}
            {(formData.desktopMedia.imageUrl ||
              formData.desktopMedia.videoUrl) && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Desktop Preview</h3>
                <div className="relative w-full h-64 overflow-hidden border border-gray-200 rounded">
                  {formData.desktopMedia.videoUrl ? (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <FiVideo className="mx-auto mb-2 text-3xl" />
                        <p className="text-sm">Video preview</p>
                        <p className="text-xs mt-1">
                          {formData.desktopMedia.videoUrl}
                        </p>
                      </div>
                    </div>
                  ) : formData.desktopMedia.imageUrl ? (
                    <img
                      src={formData.desktopMedia.imageUrl}
                      alt="Desktop preview"
                      className="w-full h-full object-cover"
                    />
                  ) : null}

                  <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: formData.desktopMedia.overlayOpacity }}
                  ></div>

                  <div
                    className={`absolute inset-0 flex flex-col items-${formData.content.alignment} justify-center p-8`}
                  >
                    {formData.content.title && (
                      <h2 className="text-white text-2xl font-bold mb-2">
                        {formData.content.title}
                      </h2>
                    )}
                    {formData.content.subtitle && (
                      <p className="text-white text-lg mb-4">
                        {formData.content.subtitle}
                      </p>
                    )}
                    {formData.content.buttonText && (
                      <button className="px-6 py-2 border-2 border-white text-white hover:bg-white hover:bg-opacity-20 transition-colors">
                        {formData.content.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Media Section */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="mb-6 flex items-center">
              <FiSmartphone className="mr-2 text-xl" />
              <h2 className="text-lg font-medium">Mobile Hero Media</h2>
            </div>

            <div className="grid grid-cols-1  md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Background Image
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="mobileMedia.imageUrl"
                    value={formData.mobileMedia.imageUrl}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-l-md"
                    placeholder="Image URL"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaLibrary("mobileImage")}
                    className="bg-gray-200 px-4 flex items-center rounded-r-md"
                  >
                    <FiImage />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Use a portrait (vertical) image for best mobile experience
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Background Video URL (Optional)
                </label>
                <input
                  type="text"
                  name="mobileMedia.videoUrl"
                  value={formData.mobileMedia.videoUrl}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com/mobile-video.mp4"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Consider using shorter/smaller videos for mobile to reduce
                  data usage
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1  md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Alt Text
                </label>
                <input
                  type="text"
                  name="mobileMedia.altText"
                  value={formData.mobileMedia.altText}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Descriptive text for the mobile image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Overlay Opacity: {formData.mobileMedia.overlayOpacity}
                </label>
                <input
                  type="range"
                  name="mobileMedia.overlayOpacity"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.mobileMedia.overlayOpacity}
                  onChange={handleChange}
                  className="w-full"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mobile screens sometimes need slightly higher opacity for
                  readability
                </p>
              </div>
            </div>

            {/* Mobile Preview */}
            {(formData.mobileMedia.imageUrl ||
              formData.mobileMedia.videoUrl) && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Mobile Preview</h3>
                <div className="flex justify-center">
                  <div className="relative w-64 h-96 overflow-hidden border border-gray-200 rounded">
                    {formData.mobileMedia.videoUrl ? (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-600">
                          <FiVideo className="mx-auto mb-2 text-3xl" />
                          <p className="text-sm">Video preview</p>
                          <p className="text-xs mt-1">
                            {formData.mobileMedia.videoUrl}
                          </p>
                        </div>
                      </div>
                    ) : formData.mobileMedia.imageUrl ? (
                      <img
                        src={formData.mobileMedia.imageUrl}
                        alt="Mobile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : null}

                    <div
                      className="absolute inset-0 bg-black"
                      style={{ opacity: formData.mobileMedia.overlayOpacity }}
                    ></div>

                    <div
                      className={`absolute inset-0 flex flex-col items-${formData.content.alignment} justify-center p-4`}
                    >
                      {formData.content.title && (
                        <h2 className="text-white text-xl font-bold mb-2">
                          {formData.content.title}
                        </h2>
                      )}
                      {formData.content.subtitle && (
                        <p className="text-white text-sm mb-4">
                          {formData.content.subtitle}
                        </p>
                      )}
                      {formData.content.buttonText && (
                        <button className="px-4 py-1 border-2 border-white text-white text-sm hover:bg-white hover:bg-opacity-20 transition-colors">
                          {formData.content.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center justify-center space-x-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                <span>Save Hero Section</span>
              </>
            )}
          </motion.button>
        </div>
      </form>

      {renderMediaLibrary()}
    </div>
  );
};

export default HeroForm;
