using System;
using System.Windows;
using System.Windows.Threading;

namespace DevTimer;

public partial class MainWindow : Window
{
    private readonly DispatcherTimer _timer = new();
    private TimeSpan _remaining;
    private bool _running;
    private int _mode;
    private int _sessions;

    private static readonly int[] Minutes = { 25, 5, 15 };
    private static readonly string[] Labels = { "Focus", "Short Break", "Long Break" };

    public MainWindow()
    {
        InitializeComponent();
        _timer.Interval = TimeSpan.FromSeconds(1);
        _timer.Tick += OnTick;
        Load(0);
    }

    private void OnTick(object? s, EventArgs e)
    {
        if (_remaining <= TimeSpan.Zero)
        {
            _timer.Stop();
            _running = false;
            if (_mode == 0) _sessions++;
            Load(_mode == 0 ? (_sessions % 4 == 0 ? 2 : 1) : 0);
            StartButton.Content = "Start";
            return;
        }
        _remaining -= TimeSpan.FromSeconds(1);
        Refresh();
    }

    private void Load(int mode)
    {
        _mode = mode;
        _remaining = TimeSpan.FromMinutes(Minutes[mode]);
        ModeText.Text = Labels[mode];
        SessionText.Text = $"Session {_sessions}";
        Refresh();
    }

    private void Refresh() => TimerText.Text = _remaining.ToString(@"mm\:ss");

    private void BtnStart_Click(object s, RoutedEventArgs e)
    {
        if (_running)
        {
            _timer.Stop();
            _running = false;
            StartButton.Content = "Start";
        }
        else
        {
            _timer.Start();
            _running = true;
            StartButton.Content = "Pause";
        }
    }

    private void BtnReset_Click(object s, RoutedEventArgs e)
    {
        _timer.Stop();
        _running = false;
        StartButton.Content = "Start";
        Load(_mode);
    }

    private void Stop()
    {
        _timer.Stop();
        _running = false;
        StartButton.Content = "Start";
    }

    private void BtnFocus_Click(object s, RoutedEventArgs e) { Stop(); Load(0); }
    private void BtnShort_Click(object s, RoutedEventArgs e) { Stop(); Load(1); }
    private void BtnLong_Click(object s, RoutedEventArgs e)  { Stop(); Load(2); }
}
