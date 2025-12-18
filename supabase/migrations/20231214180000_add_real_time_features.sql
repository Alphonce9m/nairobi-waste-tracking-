-- Enable the pg_crypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('user', 'request', 'system')),
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for notifications
CREATE TRIGGER update_notifications_modtime
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Function to log activities
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activities (type, action, description, user_id, metadata)
    VALUES (
      CASE 
        WHEN TG_TABLE_NAME = 'profiles' THEN 'user'
        WHEN TG_TABLE_NAME = 'service_requests' THEN 'request'
        ELSE 'system'
      END,
      'New ' || TG_TABLE_NAME,
      'A new ' || TG_TABLE_NAME || ' was created',
      NEW.user_id,
      jsonb_build_object('id', NEW.id, 'table', TG_TABLE_NAME)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO activities (type, action, description, user_id, metadata)
    VALUES (
      CASE 
        WHEN TG_TABLE_NAME = 'profiles' THEN 'user'
        WHEN TG_TABLE_NAME = 'service_requests' THEN 'request'
        ELSE 'system'
      END,
      'Updated ' || TG_TABLE_NAME,
      'A ' || TG_TABLE_NAME || ' was updated',
      NEW.user_id,
      jsonb_build_object('id', NEW.id, 'table', TG_TABLE_NAME)
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO activities (type, action, description, user_id, metadata)
    VALUES (
      CASE 
        WHEN TG_TABLE_NAME = 'profiles' THEN 'user'
        WHEN TG_TABLE_NAME = 'service_requests' THEN 'request'
        ELSE 'system'
      END,
      'Deleted ' || TG_TABLE_NAME,
      'A ' || TG_TABLE_NAME || ' was deleted',
      OLD.user_id,
      jsonb_build_object('id', OLD.id, 'table', TG_TABLE_NAME)
    );
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for important tables
CREATE OR REPLACE TRIGGER log_profile_activity
AFTER INSERT OR UPDATE OR DELETE ON profiles
FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE OR REPLACE TRIGGER log_request_activity
AFTER INSERT OR UPDATE OR DELETE ON service_requests
FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Function to create notifications
CREATE OR REPLACE FUNCTION create_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO notifications (type, message, user_id, metadata)
    VALUES (
      'info',
      'New ' || TG_TABLE_NAME || ' created',
      NEW.user_id,
      jsonb_build_object('table', TG_TABLE_NAME, 'id', NEW.id)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status <> NEW.status THEN
      INSERT INTO notifications (type, message, user_id, metadata)
      VALUES (
        'info',
        'Status changed to ' || NEW.status,
        NEW.user_id,
        jsonb_build_object(
          'table', TG_TABLE_NAME,
          'id', NEW.id,
          'old_status', OLD.status,
          'new_status', NEW.status
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for notifications
CREATE OR REPLACE TRIGGER notify_new_profile
AFTER INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION create_notification();

CREATE OR REPLACE TRIGGER notify_request_change
AFTER INSERT OR UPDATE ON service_requests
FOR EACH ROW EXECUTE FUNCTION create_notification();

-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE notifications, activities;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);

-- Create RLS policies for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their notifications as read"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activities are viewable by admins"
  ON activities FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  ));
