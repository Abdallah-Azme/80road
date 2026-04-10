# ──────────────────────────────────────────────────────────────────────────────
# ProGuard / R8 Rules for 80road Capacitor App
# Applied when minifyEnabled = true (release builds)
# ──────────────────────────────────────────────────────────────────────────────

# ── Debugging ─────────────────────────────────────────────────────────────────
# Preserve line numbers in stack traces for production crash reports
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ── Firebase Cloud Messaging ───────────────────────────────────────────────────
# Without these rules, FCM service classes get obfuscated and notifications
# are never received in release builds.
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# Keep FCM token refresh service
-keep class com.google.firebase.messaging.FirebaseMessagingService { *; }
-keep class com.google.firebase.iid.** { *; }

# ── Capacitor Bridge ───────────────────────────────────────────────────────────
# Capacitor uses reflection to call plugin methods from JavaScript.
# Without keeping these, the JS ↔ native bridge silently breaks.
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep @com.getcapacitor.annotation.PluginMethod class * { *; }
-dontwarn com.getcapacitor.**

# ── WebView JavaScript Interface ──────────────────────────────────────────────
# Keep all @JavascriptInterface annotated methods so the WebView can call them.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ── AndroidX & Support Libraries ─────────────────────────────────────────────
-keep class androidx.** { *; }
-dontwarn androidx.**

# ── Kotlin Coroutines ─────────────────────────────────────────────────────────
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembers class kotlinx.coroutines.** { volatile <fields>; }

# ── OkHttp & Networking ───────────────────────────────────────────────────────
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# ── General Android Safety Rules ─────────────────────────────────────────────
# Keep Serializable classes so they survive R8
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep Parcelable implementations
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Keep enum values (used by Capacitor plugin annotations)
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
