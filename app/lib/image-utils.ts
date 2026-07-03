export function upscaleResortImage(url: string | null | undefined) {
  if (!url) {
    return null;
  }

  if (url.includes("thepalacecompany.canto.com")) {
    return url.replace("/240?angle=0", "/1600?angle=0");
  }

  if (url.includes("images.unsplash.com")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}auto=format&fit=crop&w=1600&q=80`;
  }

  return url;
}
