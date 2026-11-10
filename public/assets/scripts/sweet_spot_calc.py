"""
Sweet Spot Calculator for Forced Perspective Projection
IKTVA 2027 / Off the Scale

Given screen dimensions and curvature, calculates the optimal
viewing position (sweet spot) where the 3D illusion is strongest.

Usage:
    python sweet_spot_calc.py --width 12 --height 4 --curve-radius 20
"""

import argparse
import math


def calculate_sweet_spot(
    screen_width: float,
    screen_height: float,
    curve_radius: float,
    viewer_height: float = 1.5,
) -> dict:
    arc_angle = screen_width / curve_radius
    half_angle = arc_angle / 2

    optimal_distance = curve_radius * math.cos(half_angle)

    horizontal_fov = 2 * math.atan2(screen_width / 2, optimal_distance)
    vertical_fov = 2 * math.atan2(screen_height / 2, optimal_distance)

    return {
        "optimal_distance_m": round(optimal_distance, 2),
        "horizontal_fov_deg": round(math.degrees(horizontal_fov), 1),
        "vertical_fov_deg": round(math.degrees(vertical_fov), 1),
        "arc_angle_deg": round(math.degrees(arc_angle), 1),
        "viewer_height_m": viewer_height,
    }


def main():
    parser = argparse.ArgumentParser(description="Sweet spot calculator")
    parser.add_argument("--width", type=float, required=True, help="Screen width (m)")
    parser.add_argument("--height", type=float, required=True, help="Screen height (m)")
    parser.add_argument("--curve-radius", type=float, required=True, help="Curvature radius (m)")
    parser.add_argument("--viewer-height", type=float, default=1.5, help="Viewer eye height (m)")
    args = parser.parse_args()

    result = calculate_sweet_spot(args.width, args.height, args.curve_radius, args.viewer_height)

    print(f"Screen: {args.width}m x {args.height}m, curve radius {args.curve_radius}m")
    print(f"Optimal viewing distance: {result['optimal_distance_m']}m")
    print(f"Horizontal FOV: {result['horizontal_fov_deg']}deg")
    print(f"Vertical FOV: {result['vertical_fov_deg']}deg")
    print(f"Arc angle: {result['arc_angle_deg']}deg")


if __name__ == "__main__":
    main()
