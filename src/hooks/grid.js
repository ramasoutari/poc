import React from "react";

const Grid2 = ({
  children,
  container,
  spacing = 2,
  gridOptions = [],
  xs,
  sm,
  md,
  lg,
  xl,
  className = "",
  ...props
}) => {
  const getSizeClass = (size) => {
    const sizeMap = {
      1: "w-1/12",
      2: "w-2/12",
      3: "w-3/12",
      4: "w-4/12",
      5: "w-5/12",
      6: "w-6/12",
      7: "w-7/12",
      8: "w-8/12",
      9: "w-9/12",
      10: "w-10/12",
      11: "w-11/12",
      12: "w-full",
      auto: "w-auto",
      true: "w-auto",
      false: "w-full",
    };
    return sizeMap[size] || "w-full";
  };

  // Process gridOptions into responsive classes
  const getResponsiveClasses = () => {
    const breakpointMap = {
      xs: "",
      sm: "sm:",
      md: "md:",
      lg: "lg:",
      xl: "xl:",
    };

    let classes = [];

    // Handle direct props first
    if (xs) classes.push(getSizeClass(xs));
    if (sm) classes.push(`sm:${getSizeClass(sm)}`);
    if (md) classes.push(`md:${getSizeClass(md)}`);
    if (lg) classes.push(`lg:${getSizeClass(lg)}`);
    if (xl) classes.push(`xl:${getSizeClass(xl)}`);

    // Then handle gridOptions
    gridOptions.forEach(({ breakpoint, size }) => {
      const prefix = breakpointMap[breakpoint] || "";
      classes.push(`${prefix}${getSizeClass(size)}`);
    });

    return classes.join(" ");
  };

  if (container) {
    return (
      <div className={`flex flex-wrap gap-${spacing} ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={`${getResponsiveClasses()} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Grid2;
