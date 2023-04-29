import CopyToClipboardButton from './CopyToClipboardButton';

const AppleAppDelegate = () => {
  let src = `
  using Foundation;
  using UIKit;
  
  namespace ShinyApp;
  
  [Register("AppDelegate")]
  public class AppDelegate : MauiUIApplicationDelegate
  {
      protected override MauiApp CreateMauiApp() => MauiProgram.CreateMauiApp();
  
      [Export("application:didRegisterForRemoteNotificationsWithDeviceToken:")]
      public void RegisteredForRemoteNotifications(UIApplication application, NSData deviceToken)
          => global::Shiny.Hosting.Host.Current.Lifecycle().OnRegisteredForRemoteNotifications(deviceToken);
  
      [Export("application:didFailToRegisterForRemoteNotificationsWithError:")]
      public void FailedToRegisterForRemoteNotifications(UIApplication application, NSError error)
          => global::Shiny.Hosting.Host.Current.Lifecycle().OnFailedToRegisterForRemoteNotifications(error);
  
      [Export("application:didReceiveRemoteNotification:fetchCompletionHandler:")]
      public void DidReceiveRemoteNotification(UIApplication application, NSDictionary userInfo, Action<UIBackgroundFetchResult> completionHandler)
          => global::Shiny.Hosting.Host.Current.Lifecycle().OnDidReceiveRemoveNotification(userInfo, completionHandler);	
  
  }`;
  
  return (
    <div>
        <figure className="code-snippet has-title lang-cs">
          <figcaption className="header">AppDelegate.cs</figcaption>
          <pre className="astro-code">{src}</pre>
        </figure>
        <CopyToClipboardButton text={src} />
    </div>
  );
};

export default AppleAppDelegate;


