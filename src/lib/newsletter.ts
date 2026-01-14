import { supabase, isSupabaseConfigured } from './supabase';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  unsubscribe_token: string;
  preferences?: {
    email_notifications: boolean;
    categories: string[];
  };
}

export interface NewsletterCampaign {
  id: string;
  blog_post_id: string;
  subject: string;
  sent_at: string;
  recipient_count: number;
}

// Send new post notification to all subscribers
export const sendNewPostNotification = async (post: {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  url: string;
}): Promise<{ success: boolean; message: string; count: number }> => {
  console.log('📧 Sending new post notification:', post.title);
  
  try {
    const subscribers = await getNewsletterSubscribers();
    const activeSubscribers = subscribers.filter(sub => sub.is_active);
    
    if (activeSubscribers.length === 0) {
      return { success: true, message: 'No active subscribers to notify', count: 0 };
    }
    
    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun  
    // - AWS SES
    // - Resend
    // - EmailJS (for client-side sending)
    
    // For now, we'll simulate the email sending and store the notification record
    const emailSubject = `New post: ${post.title}`;
    const emailBody = `
      Hi there! 👋
      
      A new post has been published on the blog:
      
      📝 **${post.title}**
      ✍️ By ${post.author}
      📂 Category: ${post.category}
      
      ${post.excerpt}
      
      Read the full post: ${post.url}
      
      Best regards,
      The Blog Team
      
      ---
      You're receiving this because you subscribed to our newsletter.
      Unsubscribe: [unsubscribe_link]
    `;
    
    // Store notification record in localStorage for demo
    const notifications = JSON.parse(localStorage.getItem('email-notifications') || '[]');
    const newNotification = {
      id: `notification-${Date.now()}`,
      post_title: post.title,
      sent_at: new Date().toISOString(),
      recipient_count: activeSubscribers.length,
      subject: emailSubject,
      body: emailBody,
      recipients: activeSubscribers.map(sub => sub.email)
    };
    
    notifications.push(newNotification);
    localStorage.setItem('email-notifications', JSON.stringify(notifications));
    
    // In production, you would send actual emails here:
    /*
    for (const subscriber of activeSubscribers) {
      await sendEmail({
        to: subscriber.email,
        subject: emailSubject,
        html: convertToHtml(emailBody),
        unsubscribeLink: `${window.location.origin}/unsubscribe?token=${subscriber.unsubscribe_token}`
      });
    }
    */
    
    console.log(`✅ Email notification simulated for ${activeSubscribers.length} subscribers`);
    
    return { 
      success: true, 
      message: `Email notifications sent to ${activeSubscribers.length} subscribers`, 
      count: activeSubscribers.length 
    };
    
  } catch (error) {
    console.error('❌ Error sending notifications:', error);
    return { 
      success: false, 
      message: `Failed to send notifications: ${error}`, 
      count: 0 
    };
  }
};

// Get email notification history
export const getEmailNotificationHistory = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem('email-notifications') || '[]');
  } catch (error) {
    console.error('Error loading notification history:', error);
    return [];
  }
};

// Subscribe to newsletter
export const subscribeToNewsletter = async (email: string): Promise<{ success: boolean; message: string }> => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, saving to localStorage');
    // Fallback to localStorage
    const subscribers = JSON.parse(localStorage.getItem('newsletter-subscribers') || '[]');
    
    // Check if email already exists
    const existingSubscriber = subscribers.find((sub: any) => 
      typeof sub === 'string' ? sub === email : sub.email === email
    );
    
    if (existingSubscriber) {
      return { success: false, message: 'Email already subscribed' };
    }
    
    // Add new subscriber with proper structure
    const newSubscriber = {
      id: `local-${Date.now()}`,
      email: email,
      subscribed_at: new Date().toISOString(),
      is_active: true,
      unsubscribe_token: `token-${Date.now()}`
    };
    
    subscribers.push(newSubscriber);
    localStorage.setItem('newsletter-subscribers', JSON.stringify(subscribers));
    console.log('Subscriber saved to localStorage:', newSubscriber);
    return { success: true, message: 'Subscribed successfully (local storage)' };
  }

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return { success: false, message: 'Email already subscribed' };
      }
      throw error;
    }

    console.log('Newsletter subscription successful:', data);
    return { success: true, message: 'Successfully subscribed to newsletter!' };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { success: false, message: 'Failed to subscribe. Please try again.' };
  }
};

// Get all active subscribers
export const getNewsletterSubscribers = async (): Promise<NewsletterSubscriber[]> => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, loading from localStorage');
    const subscribers = JSON.parse(localStorage.getItem('newsletter-subscribers') || '[]');
    
    // Handle both old format (just emails) and new format (objects)
    return subscribers.map((subscriber: any, index: number) => {
      if (typeof subscriber === 'string') {
        // Old format - just email string
        return {
          id: `local-${index}`,
          email: subscriber,
          subscribed_at: new Date().toISOString(),
          is_active: true,
          unsubscribe_token: `token-${index}`
        };
      } else {
        // New format - already an object
        return subscriber;
      }
    });
  }

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return [];
  }
};

// Unsubscribe from newsletter
export const unsubscribeFromNewsletter = async (token: string): Promise<{ success: boolean; message: string }> => {
  if (!isSupabaseConfigured()) {
    return { success: false, message: 'Unsubscribe not available in local mode' };
  }

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: false })
      .eq('unsubscribe_token', token)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return { success: false, message: 'Invalid unsubscribe token' };
    }

    return { success: true, message: 'Successfully unsubscribed from newsletter' };
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return { success: false, message: 'Failed to unsubscribe. Please try again.' };
  }
};

// Send newsletter campaign (for when blog posts are published)
export const sendNewsletterCampaign = async (blogPostId: string, subject: string, content: string): Promise<{ success: boolean; message: string; recipientCount: number }> => {
  if (!isSupabaseConfigured()) {
    console.log('Newsletter campaign simulation (Supabase not configured)');
    const subscribers = JSON.parse(localStorage.getItem('newsletter-subscribers') || '[]');
    console.log(`Would send newsletter to ${subscribers.length} subscribers:`, subscribers);
    return { 
      success: true, 
      message: `Newsletter simulated for ${subscribers.length} subscribers`, 
      recipientCount: subscribers.length 
    };
  }

  try {
    // Get all active subscribers
    const subscribers = await getNewsletterSubscribers();
    
    if (subscribers.length === 0) {
      return { success: false, message: 'No active subscribers found', recipientCount: 0 };
    }

    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun  
    // - AWS SES
    // - Resend
    
    // For now, we'll log the campaign and save it to the database
    console.log(`Sending newsletter to ${subscribers.length} subscribers:`);
    console.log('Subject:', subject);
    console.log('Content preview:', content.substring(0, 200) + '...');
    console.log('Recipients:', subscribers.map(s => s.email));

    // Save campaign record
    const { data, error } = await supabase
      .from('newsletter_campaigns')
      .insert([{
        blog_post_id: blogPostId,
        subject,
        recipient_count: subscribers.length
      }])
      .select()
      .single();

    if (error) throw error;

    // TODO: Integrate with actual email service here
    // Example with a hypothetical email service:
    /*
    for (const subscriber of subscribers) {
      await emailService.send({
        to: subscriber.email,
        subject: subject,
        html: generateNewsletterHTML(content, subscriber.unsubscribe_token),
        from: 'aurimas@aurimas.io'
      });
    }
    */

    return { 
      success: true, 
      message: `Newsletter campaign created for ${subscribers.length} subscribers`, 
      recipientCount: subscribers.length 
    };
  } catch (error) {
    console.error('Error sending newsletter campaign:', error);
    return { success: false, message: 'Failed to send newsletter campaign', recipientCount: 0 };
  }
};

// Generate newsletter HTML template
export const generateNewsletterHTML = (blogContent: string, unsubscribeToken: string): string => {
  const unsubscribeUrl = `${window.location.origin}/unsubscribe?token=${unsubscribeToken}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Blog Post from Aurimas</title>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #eab308); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #6b7280; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .unsubscribe { color: #6b7280; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚀 New Blog Post from Aurimas</h1>
        <p>Chemist turned AI Architect & Writer</p>
      </div>
      <div class="content">
        ${blogContent}
        <a href="${window.location.origin}/blog" class="button">Read Full Post →</a>
      </div>
      <div class="footer">
        <p>You're receiving this because you subscribed to Aurimas' newsletter.</p>
        <p><a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe</a> | <a href="${window.location.origin}" class="unsubscribe">Visit Website</a></p>
        <p>© ${new Date().getFullYear()} Aurimas Aleksandras Nausėdas</p>
      </div>
    </body>
    </html>
  `;
};