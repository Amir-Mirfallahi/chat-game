#!/usr/bin/env python3

"""
Tavus Persona Creator for CHAT Agent
Creates a child-friendly persona optimized for language development
"""

import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

def create_chat_persona():
    """Create a Tavus persona optimized for child language development"""
    
    api_key = os.getenv("TAVUS_API_KEY")
    if not api_key:
        raise ValueError("TAVUS_API_KEY not found in environment variables")
    
    print("🎭 Creating CHAT persona for child language development...")
    
    url = "https://tavusapi.com/v2/personas"
    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key
    }
    
    # Child-friendly persona configuration
    persona_data = {
        "persona_name": "Customer Service Agent",
        "pipeline_mode": "echo",
        "layers": {
            "transport": {
                "transport_type": "livekit"
            }
        }
    }
    
    try:
        print("📡 Sending request to Tavus API...")
        response = requests.post(url, headers=headers, json=persona_data)
        response.raise_for_status()
        
        result = response.json()
        persona_id = result.get("persona_id")
        
        print(f"✅ Persona created successfully!")
        print(f"📋 Persona ID: {persona_id}")
        print(f"🏷️  Persona Name: {result.get('persona_name')}")
        print(f"🔧 Pipeline Mode: {result.get('pipeline_mode')}")
        
        # Update .env file with the new persona ID
        env_file_path = '.env'
        env_lines = []
        persona_id_exists = False
        
        # Read existing .env file if it exists
        if os.path.exists(env_file_path):
            with open(env_file_path, 'r') as f:
                env_lines = f.readlines()
        
        # Update or add TAVUS_PERSONA_ID
        for i, line in enumerate(env_lines):
            if line.startswith('TAVUS_PERSONA_ID='):
                env_lines[i] = f'TAVUS_PERSONA_ID={persona_id}\n'
                persona_id_exists = True
                break
        
        if not persona_id_exists:
            env_lines.append(f'TAVUS_PERSONA_ID={persona_id}\n')
        
        # Write back to .env file
        with open(env_file_path, 'w') as f:
            f.writelines(env_lines)
        
        print(f"✅ Updated .env file with TAVUS_PERSONA_ID")
        print(f"🎯 Your persona is ready for CHAT agent!")
        
        return persona_id
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error creating persona: {e}")
        if hasattr(e, 'response') and e.response:
            try:
                error_data = e.response.json()
                print(f"📋 Error details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📋 Response text: {e.response.text}")
        return None
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return None



def validate_environment():
    """Validate that all required environment variables are set"""
    
    print("🔍 Validating environment setup...")
    
    required_vars = {
        "TAVUS_API_KEY": "Your Tavus API key",
        "TAVUS_REPLICA_ID": "Your Tavus replica ID (optional for persona creation)",
    }
    
    missing_vars = []
    for var, description in required_vars.items():
        value = os.getenv(var)
        if value:
            print(f"✅ {var}: {'*' * (len(value) - 4)}{value[-4:]}")
        else:
            print(f"❌ {var}: Missing ({description})")
            missing_vars.append(var)
    
    if missing_vars:
        print("\n⚠️  Please add the missing environment variables to your .env file:")
        for var in missing_vars:
            print(f"   {var}=your_value_here")
        return False
    
    print("✅ Environment validation passed!")
    return True


def main():
    """Main function to create CHAT persona"""
    
    print("🎭 CHAT Persona Creator for Tavus Avatar")
    print("=" * 50)
    
    # Validate environment
    if not validate_environment():
        print("❌ Please fix environment issues before continuing.")
        return
    
    # Create new persona
    print("=" * 50)
    persona_id = create_chat_persona()
    
    if persona_id:
        print("\n🎉 Success! Your CHAT persona is ready.")
        print("\n📋 Next steps:")
        print("1. Ensure your TAVUS_REPLICA_ID is set in .env")
        print("2. Run your CHAT agent: python agent.py")
        print("3. Test with a child participant")
        print("\n💡 Tips:")
        print("- Use simple words when testing")
        print("- Allow time for the child to respond")
        print("- Celebrate any vocalization attempts")
    else:
        print("\n❌ Failed to create persona. Please check the errors above.")


if __name__ == "__main__":
    main()