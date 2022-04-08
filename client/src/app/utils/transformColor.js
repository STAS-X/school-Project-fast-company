export function transformBootColor(color) {
    switch (color) {
        case "primary":
            color = "#0d6efd";
            break;
        case "secondary":
            color = "#6c757d";
            break;
        case "success":
            color = "#198754";
            break;
        case "info":
            color = "#0dcaf0";
            break;
        case "warning":
            color = "#ffc107";
            break;
        case "danger":
            color = "#dc3545";
            break;
        case "light":
            color = "#f8f9fa";
            break;
        case "dark":
            color = "#212529";
            break;
    }

    return color;
}
