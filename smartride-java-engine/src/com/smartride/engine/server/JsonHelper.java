package com.smartride.engine.server;

import java.io.*;
import java.util.*;

/**
 * JsonHelper - Lightweight JSON parser/serializer using ONLY core Java.
 *
 * WHY NOT Gson/Jackson?
 * The project constraint is STRICTLY NO EXTERNAL FRAMEWORKS.
 * This handles the simple JSON structures we need for REST communication.
 *
 * Supports: String, Number, Boolean, List, Map, null
 */
public class JsonHelper {

    // =================== SERIALIZATION ===================

    /** Serialize a Map/List/primitive to a JSON string. */
    public static String toJson(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof Map) return mapToJson((Map<?, ?>) obj);
        if (obj instanceof List) return listToJson((List<?>) obj);
        if (obj instanceof String) return "\"" + escapeString((String) obj) + "\"";
        if (obj instanceof Number || obj instanceof Boolean) return obj.toString();
        return "\"" + escapeString(obj.toString()) + "\"";
    }

    private static String mapToJson(Map<?, ?> map) {
        StringBuilder sb = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<?, ?> entry : map.entrySet()) {
            if (!first) sb.append(",");
            sb.append("\"").append(escapeString(entry.getKey().toString())).append("\":");
            sb.append(toJson(entry.getValue()));
            first = false;
        }
        sb.append("}");
        return sb.toString();
    }

    private static String listToJson(List<?> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(toJson(list.get(i)));
        }
        sb.append("]");
        return sb.toString();
    }

    private static String escapeString(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
    }

    // =================== DESERIALIZATION ===================

    /** Parse a JSON string into Map/List/String/Number/Boolean/null. */
    public static Object parse(String json) {
        json = json.trim();
        return parseValue(json, new int[]{0});
    }

    /** Parse a JSON string into a Map. */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> parseObject(String json) {
        Object result = parse(json);
        if (result instanceof Map) return (Map<String, Object>) result;
        throw new RuntimeException("Expected JSON object, got: " + (result == null ? "null" : result.getClass()));
    }

    private static Object parseValue(String json, int[] pos) {
        skipWhitespace(json, pos);
        if (pos[0] >= json.length()) return null;
        char c = json.charAt(pos[0]);
        if (c == '{') return parseMap(json, pos);
        if (c == '[') return parseList(json, pos);
        if (c == '"') return parseString(json, pos);
        if (c == 't' || c == 'f') return parseBoolean(json, pos);
        if (c == 'n') return parseNull(json, pos);
        return parseNumber(json, pos);
    }

    private static Map<String, Object> parseMap(String json, int[] pos) {
        Map<String, Object> map = new LinkedHashMap<>();
        pos[0]++; // skip '{'
        skipWhitespace(json, pos);
        if (pos[0] < json.length() && json.charAt(pos[0]) == '}') {
            pos[0]++;
            return map;
        }
        while (pos[0] < json.length()) {
            skipWhitespace(json, pos);
            String key = parseString(json, pos);
            skipWhitespace(json, pos);
            pos[0]++; // skip ':'
            Object value = parseValue(json, pos);
            map.put(key, value);
            skipWhitespace(json, pos);
            if (pos[0] < json.length() && json.charAt(pos[0]) == ',') {
                pos[0]++;
            } else {
                break;
            }
        }
        if (pos[0] < json.length() && json.charAt(pos[0]) == '}') pos[0]++;
        return map;
    }

    private static List<Object> parseList(String json, int[] pos) {
        List<Object> list = new ArrayList<>();
        pos[0]++; // skip '['
        skipWhitespace(json, pos);
        if (pos[0] < json.length() && json.charAt(pos[0]) == ']') {
            pos[0]++;
            return list;
        }
        while (pos[0] < json.length()) {
            list.add(parseValue(json, pos));
            skipWhitespace(json, pos);
            if (pos[0] < json.length() && json.charAt(pos[0]) == ',') {
                pos[0]++;
            } else {
                break;
            }
        }
        if (pos[0] < json.length() && json.charAt(pos[0]) == ']') pos[0]++;
        return list;
    }

    private static String parseString(String json, int[] pos) {
        pos[0]++; // skip opening '"'
        StringBuilder sb = new StringBuilder();
        while (pos[0] < json.length()) {
            char c = json.charAt(pos[0]);
            if (c == '\\' && pos[0] + 1 < json.length()) {
                pos[0]++;
                char next = json.charAt(pos[0]);
                switch (next) {
                    case '"': sb.append('"'); break;
                    case '\\': sb.append('\\'); break;
                    case 'n': sb.append('\n'); break;
                    case 'r': sb.append('\r'); break;
                    case 't': sb.append('\t'); break;
                    default: sb.append(next);
                }
            } else if (c == '"') {
                pos[0]++;
                return sb.toString();
            } else {
                sb.append(c);
            }
            pos[0]++;
        }
        return sb.toString();
    }

    private static Number parseNumber(String json, int[] pos) {
        int start = pos[0];
        boolean isFloat = false;
        while (pos[0] < json.length()) {
            char c = json.charAt(pos[0]);
            if (c == '.' || c == 'e' || c == 'E') isFloat = true;
            if (Character.isDigit(c) || c == '.' || c == '-' || c == '+' || c == 'e' || c == 'E') {
                pos[0]++;
            } else {
                break;
            }
        }
        String numStr = json.substring(start, pos[0]);
        if (isFloat) return Double.parseDouble(numStr);
        long val = Long.parseLong(numStr);
        if (val >= Integer.MIN_VALUE && val <= Integer.MAX_VALUE) return (int) val;
        return val;
    }

    private static Boolean parseBoolean(String json, int[] pos) {
        if (json.startsWith("true", pos[0])) {
            pos[0] += 4;
            return true;
        }
        pos[0] += 5;
        return false;
    }

    private static Object parseNull(String json, int[] pos) {
        pos[0] += 4;
        return null;
    }

    private static void skipWhitespace(String json, int[] pos) {
        while (pos[0] < json.length() && Character.isWhitespace(json.charAt(pos[0]))) {
            pos[0]++;
        }
    }

    /** Read the entire body from an InputStream. */
    public static String readBody(InputStream is) throws IOException {
        return new String(is.readAllBytes());
    }
}
