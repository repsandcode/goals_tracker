# Generated by Django 5.0.2 on 2024-12-29 14:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('goals_tracker', '0018_userfcmtoken'),
    ]

    operations = [
        migrations.DeleteModel(
            name='UserFCMToken',
        ),
    ]
